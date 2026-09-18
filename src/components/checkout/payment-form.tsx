"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("El sistema de pago no está listo.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/result`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "Hubo un error al procesar el pago.");
      }
    } catch (err) {
      setErrorMessage("Ocurrió un error inesperado.");
      console.error("[payment-form]", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="p-3 rounded-lg bg-wine/10 text-wine text-sm border border-wine/20">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark disabled:opacity-40 font-semibold"
      >
        {loading ? "Procesando pago…" : "Pagar ahora"}
      </button>
    </form>
  );
}
