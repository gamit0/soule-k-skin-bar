/**
 * Interfaz de proveedor de pagos. La implementación inicial (Fase 6) será
 * Stripe, pero el resto del sistema (CheckoutService) solo depende de esta
 * interfaz — así se pueden sumar métodos de pago populares en México
 * (OXXO Pay, Mercado Pago) sin tocar la lógica de checkout.
 */
export interface CreatePaymentIntentInput {
  orderId: string;
  amount: number; // en centavos
  currency: string; // ej. "mxn"
  customerEmail?: string;
}

export interface PaymentIntentResult {
  providerRef: string;
  clientSecret?: string;
}

export interface PaymentProvider {
  createPaymentIntent(
    input: CreatePaymentIntentInput,
  ): Promise<PaymentIntentResult>;

  verifyWebhookSignature(rawBody: string, signature: string): boolean;
}
