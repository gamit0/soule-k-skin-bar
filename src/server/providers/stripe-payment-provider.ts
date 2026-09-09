import Stripe from "stripe";
import type {
  PaymentProvider,
  CreatePaymentIntentInput,
  PaymentIntentResult,
} from "./payment-provider";

/**
 * Implementación de PaymentProvider con Stripe (Fase 6). El resto del
 * sistema (CheckoutService, la ruta de checkout) solo conoce la interfaz
 * PaymentProvider — cambiar de proveedor de pago no debería tocar nada
 * fuera de este archivo.
 */
export class StripePaymentProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY no está definida.");
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(
    input: CreatePaymentIntentInput,
  ): Promise<PaymentIntentResult> {
    const intent = await this.stripe.paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      receipt_email: input.customerEmail,
      metadata: { orderId: input.orderId },
    });

    return {
      providerRef: intent.id,
      clientSecret: intent.client_secret ?? undefined,
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET no está definida.");
    }
    try {
      this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      return true;
    } catch {
      return false;
    }
  }

  getClient() {
    return this.stripe;
  }
}
