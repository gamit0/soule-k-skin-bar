import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";
import { mockProducts } from "@/mock-data/products";
import { calcShipping, calcTotal } from "@/lib/shipping";

const CART_COOKIE_NAME = "soule-k-n8n-cart-session";

// In-memory cart storage (same as cart/route.ts)
const cartSessions = new Map<string, CartItem[]>();

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  cocktailId?: string;
}

async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return sessionId;
}

async function getCartItemsWithDetails(sessionId: string) {
  const items = cartSessions.get(sessionId) || [];

  if (items.length === 0) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

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

type UpdateQuantityBody = {
  quantity: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const { productId } = await params;
    const body: UpdateQuantityBody = await request.json();
    const { quantity } = body;

    if (typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json(
        { error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    const sessionId = await getCartSessionId();
    const cart = cartSessions.get(sessionId) || [];

    if (quantity === 0) {
      // Remove item
      const filtered = cart.filter(i => i.productId !== productId);
      cartSessions.set(sessionId, filtered);
    } else {
      // Validate product and stock
      let product: any = null;
      try {
        product = await db.query.products.findFirst({
          where: eq(products.id, productId),
        });
      } catch {
        // fallback
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

      if ((product.stock ?? 10) < quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente. Disponible: ${product.stock ?? 10}` },
          { status: 400 }
        );
      }

      const existingIndex = cart.findIndex(i => i.productId === productId);
      if (existingIndex >= 0 && cart[existingIndex]) {
        cart[existingIndex].quantity = quantity;
      } else {
        return NextResponse.json(
          { error: "Producto no está en el carrito" },
          { status: 404 }
        );
      }
      cartSessions.set(sessionId, cart);
    }

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
      message: quantity === 0 ? "Producto eliminado del carrito" : "Cantidad actualizada",
    });
  } catch (err) {
    console.error("[n8n/cart/[productId] PATCH] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const { productId } = await params;
    const sessionId = await getCartSessionId();
    const cart = cartSessions.get(sessionId) || [];

    const filtered = cart.filter(i => i.productId !== productId);
    cartSessions.set(sessionId, filtered);

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
      message: "Producto eliminado del carrito",
    });
  } catch (err) {
    console.error("[n8n/cart/[productId] DELETE] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}