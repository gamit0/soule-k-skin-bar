import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";
import { mockProducts } from "@/mock-data/products";
import { calcShipping, calcTotal } from "@/lib/shipping";

const CART_COOKIE_NAME = "soule-k-n8n-cart-session";

// In-memory cart storage (for demo - in production use database)
// Key: sessionId, Value: CartItem[]
const cartSessions = new Map<string, CartItem[]>();

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  cocktailId?: string;
}

// Get or create cart session ID
async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return sessionId;
}

// Get cart items with product details
async function getCartItemsWithDetails(sessionId: string) {
  const items = cartSessions.get(sessionId) || [];

  if (items.length === 0) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  // Get product details from DB or mock
  const productIds = items.map(i => i.productId);
  let dbProducts: any[] = [];
  let useMock = false;

  try {
    dbProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
    });
    if (dbProducts.length !== productIds.length) useMock = true;
  } catch {
    useMock = true;
  }

  const detailedItems = items.map(item => {
    let product = dbProducts.find(p => p.id === item.productId);
    if (!product && useMock) {
      product = mockProducts.find(p => p.id === item.productId);
    }

    // Provide fallback values in case product is not found
    const productData = product ? {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: Number(product.price),
      stock: product.stock ?? 10,
      inStock: (product.stock ?? 10) > 0,
      active: product.active,
      image: product.images?.[0]?.url,
    } : {
      id: item.productId,
      slug: '',
      name: item.name,
      brand: '',
      price: item.price,
      stock: 10,
      inStock: true,
      active: true,
      image: '',
    };

    return {
      ...item,
      product: productData,
      lineTotal: item.price * item.quantity,
    };
  });

  const subtotal = detailedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const totalItems = detailedItems.reduce((sum, i) => sum + i.quantity, 0);

  return { items: detailedItems, subtotal, totalItems };
}

export async function GET(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const sessionId = await getCartSessionId();
    const { items, subtotal, totalItems } = await getCartItemsWithDetails(sessionId);

    const shipping = calcShipping(subtotal);
    const total = calcTotal(subtotal);

    return NextResponse.json({
      sessionId,
      items,
      subtotal,
      shipping,
      total,
      totalItems,
      freeShippingThreshold: 1200,
      amountForFreeShipping: Math.max(0, 1200 - subtotal),
    });
  } catch (err) {
    console.error("[n8n/cart GET] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

type AddToCartBody = {
  productId: string;
  quantity?: number;
  cocktailId?: string;
};

export async function POST(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const body: AddToCartBody = await request.json();
    const { productId, quantity = 1, cocktailId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId es requerido" },
        { status: 400 }
      );
    }

    // Validate product exists and get price
    let product: any = null;
    try {
      product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });
    } catch {
      // fallback to mock
    }

    if (!product) {
      product = mockProducts.find(p => p.id === productId);
    }

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (!product.active) {
      return NextResponse.json(
        { error: "Producto no disponible" },
        { status: 400 }
      );
    }

    if ((product.stock ?? 10) < quantity) {
      return NextResponse.json(
        { error: `Stock insuficiente. Disponible: ${product.stock ?? 10}` },
        { status: 400 }
      );
    }

    const sessionId = await getCartSessionId();
    const cart = cartSessions.get(sessionId) || [];

    const existingIndex = cart.findIndex(i => i.productId === productId);
    if (existingIndex >= 0 && cart[existingIndex]) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: Number(product.price),
        quantity,
        cocktailId,
      });
    }

    cartSessions.set(sessionId, cart);

    const { items, subtotal, totalItems } = await getCartItemsWithDetails(sessionId);
    const shipping = calcShipping(subtotal);
    const total = calcTotal(subtotal);

    return NextResponse.json({
      sessionId,
      items,
      subtotal,
      shipping,
      total,
      totalItems,
      message: "Producto agregado al carrito",
    });
  } catch (err) {
    console.error("[n8n/cart POST] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

type ClearCartBody = {
  confirm?: boolean;
};

export async function DELETE(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const sessionId = await getCartSessionId();
    cartSessions.delete(sessionId);

    return NextResponse.json({
      sessionId,
      items: [],
      subtotal: 0,
      shipping: 150,
      total: 150,
      totalItems: 0,
      message: "Carrito vaciado",
    });
  } catch (err) {
    console.error("[n8n/cart DELETE] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}