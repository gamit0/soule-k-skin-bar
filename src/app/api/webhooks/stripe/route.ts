import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { StripePaymentProvider } from "@/server/providers/stripe-payment-provider";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  const paymentProvider = new StripePaymentProvider();
  if (!paymentProvider.verifyWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(payload);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.id;

    await db
      .update(orders)
      .set({ status: "paid" })
      .where(eq(orders.paymentProviderRef, paymentId));
  }

  return NextResponse.json({ received: true });
}
