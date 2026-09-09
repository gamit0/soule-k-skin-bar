import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders, orderItems } from "@/lib/db/schema";
import { StripePaymentProvider } from "@/server/providers/stripe-payment-provider";

type CheckoutBody = {
  items: { productId: string; name: string; price: number; quantity: number; cocktailId?: string }[];
  guestEmail?: string;
  guestPhone?: string;
  customerId?: string; // si el usuario tiene sesión (Fase 7)
};

export async function POST(request: Request) {
  const body: CheckoutBody = await request.json();

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  // Checkout como invitado O con cuenta — ambos soportados (decisión de Fase 1).
  if (!body.customerId && !body.guestEmail) {
    return NextResponse.json(
      { error: "Se necesita un email (invitado) o una cuenta." },
      { status: 400 },
    );
  }

  const subtotal = body.items.reduce((s, i) => s + i.price * i.quantity, 0);

  try {
    const [order] = await db
      .insert(orders)
      .values({
        customerId: body.customerId,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        subtotal: subtotal.toFixed(2),
        total: subtotal.toFixed(2),
        status: "pending",
      })
      .returning();

    await db.insert(orderItems).values(
      body.items.map((item) => ({
        orderId: order!.id,
        productId: item.productId,
        cocktailId: item.cocktailId,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
      })),
    );

    const paymentProvider = new StripePaymentProvider();
    const intent = await paymentProvider.createPaymentIntent({
      orderId: order!.id,
      amount: Math.round(subtotal * 100), // Stripe usa centavos
      currency: "mxn",
      customerEmail: body.guestEmail,
    });

    await db
      .update(orders)
      .set({ paymentProviderRef: intent.providerRef })
      .where(eq(orders.id, order!.id));

    return NextResponse.json({
      orderId: order!.id,
      clientSecret: intent.clientSecret,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
