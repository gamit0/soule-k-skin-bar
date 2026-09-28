import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders, orderItems, products } from "@/lib/db/schema";
import { StripePaymentProvider } from "@/server/providers/stripe-payment-provider";
import { mockProducts } from "@/mock-data/products";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";
import { calcShipping, calcTotal } from "@/lib/shipping";
import { randomUUID } from "crypto";

const CART_COOKIE_NAME = "soule-k-n8n-cart-session";

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

type CheckoutBody = {
  guestEmail: string;
  guestPhone?: string;
  customerId?: string;
};

export async function POST(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const body: CheckoutBody = await request.json();
    const { guestEmail, guestPhone, customerId } = body;

    if (!guestEmail && !customerId) {
      return NextResponse.json(
        { error: "Se necesita un email (invitado) o una cuenta." },
        { status: 400 }
      );
    }

    const sessionId = await getCartSessionId();
    const cart = cartSessions.get(sessionId) || [];

    if (cart.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    // Server-side price validation and stock check
    const productIds = cart.map(i => i.productId);
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

    let validatedSubtotal = 0;
    const validatedItems = [];

    for (const item of cart) {
      let dbProd = dbProducts.find(p => p.id === item.productId);
      if (!dbProd && useMock) {
        dbProd = mockProducts.find(p => p.id === item.productId);
      }
      if (!dbProd) continue;
      if (!dbProd.active) {
        return NextResponse.json({ error: `El producto ${dbProd.name} ya no está disponible.` }, { status: 400 });
      }
      if ((dbProd.stock ?? 10) < item.quantity) {
        return NextResponse.json({ error: `Stock insuficiente para ${dbProd.name}. Disponible: ${dbProd.stock ?? 10}` }, { status: 400 });
      }
      const unitPrice = Number(dbProd.price);
      validatedSubtotal += unitPrice * item.quantity;
      validatedItems.push({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice,
        cocktailId: item.cocktailId,
      });
    }

    const shipping = calcShipping(validatedSubtotal);
    const total = calcTotal(validatedSubtotal);

    // Create Order
    const [order] = await db
      .insert(orders)
      .values({
        customerId,
        guestEmail,
        guestPhone,
        subtotal: validatedSubtotal.toFixed(2),
        total: total.toFixed(2),
        status: "pending",
      })
      .returning();

    await db.insert(orderItems).values(
      validatedItems.map((item) => ({
        orderId: order!.id,
        productId: item.productId,
        cocktailId: item.cocktailId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
      }))
    );

    // Payment Integration
    const paymentProvider = new StripePaymentProvider();
    const intent = await paymentProvider.createPaymentIntent({
      orderId: order!.id,
      amount: Math.round(total * 100),
      currency: "mxn",
      customerEmail: guestEmail,
    });

    await db
      .update(orders)
      .set({ paymentProviderRef: intent.providerRef })
      .where(eq(orders.id, order!.id));

    // Clear cart after successful order creation
    cartSessions.delete(sessionId);

    return NextResponse.json({
      orderId: order!.id,
      clientSecret: intent.clientSecret,
      subtotal: validatedSubtotal,
      shipping,
      total,
    });
  } catch (err) {
    console.error("[n8n/checkout]", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 500 }
    );
  }
}