import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders, products } from "@/lib/db/schema";
import { StripePaymentProvider } from "@/server/providers/stripe-payment-provider";

// Los webhooks son la ÚNICA fuente de verdad del estado de pago — nunca
// confiar en el redirect del cliente para marcar una orden como pagada.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  const provider = new StripePaymentProvider();

  if (!provider.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === "payment_intent.succeeded") {
    const providerRef = event.data.object.id as string;

    const order = await db.query.orders.findFirst({
      where: eq(orders.paymentProviderRef, providerRef),
      with: { items: true },
    });

    if (order) {
      // Idempotencia: si ya está paid, no reprocesar (evita doble
      // descuento de stock si Stripe reintenta el evento).
      if (order.status !== "paid") {
        await db
          .update(orders)
          .set({ status: "paid", paymentStatus: "paid" })
          .where(eq(orders.id, order.id));

        for (const item of order.items) {
          await db
            .update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
