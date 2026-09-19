"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "@/components/checkout/payment-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, guestEmail, guestPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setClientSecret(data.clientSecret);
    } catch {
      setError("No se pudo iniciar el checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Checkout
          </h1>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full rounded-lg border border-plum-ink/15 px-4 py-3"
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full rounded-lg border border-plum-ink/15 px-4 py-3"
            />
            <p className="text-xs text-plum-ink/50">
              Puedes comprar como invitada/o. Si ya tienes cuenta,{" "}
              <a href="/login" className="text-wine">
                inicia sesión
              </a>{" "}
              para guardar tu historial.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-plum-ink/10 pt-4">
            <p className="text-plum-ink/70">Subtotal</p>
            <p className="text-lg text-plum-ink">${subtotal.toFixed(2)} MXN</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-plum-ink/70">
            <p>Envío</p>
            <p className="font-semibold">
              {subtotal >= 1200 ? "GRATIS" : "$150.00 MXN"}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-plum-ink/10 pt-4">
            <p className="text-plum-ink">Total</p>
            <p className="text-lg font-bold text-plum-ink">${(subtotal + (subtotal >= 1200 ? 0 : 150)).toFixed(2)} MXN</p>
          </div>

          {error && <p className="mt-4 text-sm text-wine">{error}</p>}

          {!clientSecret ? (
            <button
              onClick={startCheckout}
              disabled={loading || items.length === 0 || !guestEmail}
              className="mt-8 w-full rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark disabled:opacity-40 font-semibold"
            >
              {loading ? "Preparando pago…" : "Continuar al pago"}
            </button>
          ) : (
            <div className="mt-8">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm />
              </Elements>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
