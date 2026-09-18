"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { generateWhatsAppCartCheckoutUrl } from "@/server/services/whatsapp-service";
import { track } from "@/lib/track";
import { calcShipping, calcTotal, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/shipping";

export default function CartPage() {
  const { items, removeItem, setQuantity, clear, subtotal } = useCart();
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({});
  const [checkingStock, setCheckingStock] = useState(true);

  useEffect(() => {
    async function checkStock() {
      if (items.length === 0) {
        setCheckingStock(false);
        return;
      }

      try {
        const res = await fetch("/api/products/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: items.map((i) => i.productId) }),
        });
        const data = await res.json();

        const status: Record<string, boolean> = {};
        data.stockStatus?.forEach((s: any) => {
          status[s.id] = s.inStock;
        });
        setStockStatus(status);
      } catch (e) {
        console.error("Error checking stock:", e);
      } finally {
        setCheckingStock(false);
      }
    }

    checkStock();
  }, [items]);

  const allInStock = items.every((item) => stockStatus[item.productId] !== false);
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const whatsAppUrl = generateWhatsAppCartCheckoutUrl({
    items: items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal,
  });

  return (
    <>
      <Header />
      <main className="shell section min-h-screen">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-plum-ink/10 pb-6 animate-fade-up">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                Soule K Skin Bar
              </p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl text-plum-ink font-normal">
                Tu Carrito
                <span className="text-wine"> ({totalItemCount})</span>
              </h1>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-xs font-semibold uppercase tracking-wider text-plum-ink/40 hover:text-wine transition-colors self-start sm:self-center cursor-pointer"
              >
                Vaciar Carrito
              </button>
            )}
          </div>

          {items.length === 0 ? (
            /* ── Empty Cart ──────────────────────────────────────────────────── */
            <div className="mt-16 text-center max-w-md mx-auto animate-fade-in">
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-wine/5 animate-pulse-soft" />
                <span className="relative text-5xl z-10">🛍️</span>
              </div>
              <h2 className="font-display text-2xl text-plum-ink">
                Tu carrito está vacío
              </h2>
              <p className="mt-2 text-sm text-plum-ink/60 leading-relaxed max-w-sm mx-auto">
                Descubre nuestros Shots K-Beauty o realiza el diagnóstico para
                encontrar la fórmula perfecta para tu piel.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/quiz" className="btn btn-primary btn-md btn-arrow w-full sm:w-auto">
                  🧪 Realizar Skin Quiz
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
                <Link href="/shots" className="btn btn-outline btn-md w-full sm:w-auto">
                  🍸 Ver Shots
                </Link>
              </div>
            </div>
          ) : (
            /* ── Active Cart ─────────────────────────────────────────────────── */
            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              {/* Items List */}
              <div className="lg:col-span-7 space-y-4">
                {/* Free Shipping Alert */}
                <div className={`rounded-2xl border p-4 transition-all ${
                  amountForFreeShipping === 0
                    ? "bg-sage/10 border-sage/30"
                    : "bg-blush/20 border-wine/10"
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold text-plum-ink">
                    <span>
                      {amountForFreeShipping === 0
                        ? "🎉 ¡Envío Gratis en este pedido!"
                        : `Agrega $${amountForFreeShipping.toFixed(2)} MXN más para Envío Gratis`}
                    </span>
                    <span className="tabular-nums">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-plum-ink/8">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${freeShippingProgress}%`,
                        background: amountForFreeShipping === 0
                          ? "var(--color-sage)"
                          : "linear-gradient(90deg, var(--color-wine), var(--color-blush))",
                      }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-3xl border border-plum-ink/10 bg-ivory divide-y divide-plum-ink/8 shadow-soft">
                  {items.map((item) => {
                    const isInStock = stockStatus[item.productId] !== false;
                    const itemTotal = item.price * item.quantity;

                    return (
                      <div
                        key={item.productId}
                        className={`flex items-start sm:items-center justify-between gap-4 p-5 sm:p-6 ${
                          !isInStock ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-semibold text-plum-ink leading-snug">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-plum-ink/50">
                            ${item.price.toFixed(2)} MXN c/u
                          </p>
                          {!isInStock && (
                            <span className="mt-2 inline-block rounded-lg bg-red-50 px-2 py-0.5 text-[0.6rem] font-semibold text-red-600 border border-red-200">
                              Agotado
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 sm:gap-5">
                          {/* Quantity Controls */}
                          <div className="flex items-center rounded-full border border-plum-ink/15 bg-pearl p-0.5">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-plum-ink/50 hover:bg-blush/40 hover:text-wine text-sm transition-colors cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-plum-ink tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              disabled={!isInStock}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-plum-ink/50 hover:bg-blush/40 hover:text-wine text-sm transition-colors disabled:opacity-30 cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total + Remove */}
                          <div className="text-right min-w-[80px]">
                            <span className="block text-sm sm:text-base font-bold text-wine tabular-nums">
                              ${itemTotal.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-[0.6rem] text-plum-ink/35 hover:text-red-500 transition-colors underline underline-offset-2 cursor-pointer"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue shopping */}
                <div className="flex items-center justify-between px-1 text-xs font-semibold text-plum-ink/40">
                  <Link href="/shots" className="hover:text-wine transition-colors">
                    ← Explorar Shots
                  </Link>
                  <Link href="/quiz" className="hover:text-wine transition-colors">
                    Rehacer Quiz →
                  </Link>
                </div>
              </div>

              {/* ── Order Summary (Sticky) ───────────────────────────────────── */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 rounded-3xl bg-gradient-to-br from-plum-ink via-plum-ink/95 to-wine p-6 sm:p-8 text-ivory shadow-xl">
                  <h2 className="font-display text-xl text-ivory">
                    Resumen del Pedido
                  </h2>

                  <div className="mt-5 space-y-2.5 text-sm border-b border-ivory/12 pb-5">
                    <div className="flex justify-between text-ivory/70">
                      <span>Subtotal ({totalItemCount} productos)</span>
                      <span className="font-semibold text-ivory tabular-nums">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ivory/70">
                      <span>Envío</span>
                      <span className={`font-semibold ${amountForFreeShipping === 0 ? "text-sage" : "text-blush"}`}>
                        {amountForFreeShipping === 0 ? "GRATIS" : `$${SHIPPING_COST.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-ivory/70">
                      <span>Asesoría K-Beauty</span>
                      <span className="font-semibold text-sage">Incluida ✨</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[0.6rem] uppercase tracking-widest text-ivory/50 block mb-1">Total</span>
                      <span className="font-display text-3xl sm:text-4xl font-bold text-ivory tabular-nums">
                        ${calcTotal(subtotal).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[0.6rem] text-ivory/50">MXN IVA Incl.</span>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="mt-7 space-y-3">
                    {whatsAppUrl ? (
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track("whatsapp_click", { source: "cart" })}
                        className="w-full btn btn-lg inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white hover:bg-[#1EBE5D] transition-all active:scale-95 shadow-md cursor-pointer text-center"
                      >
                        💬 Pedir por WhatsApp
                      </a>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center rounded-full bg-ivory/10 px-6 py-4 text-sm text-ivory/40 cursor-not-allowed text-center">
                        💬 WhatsApp — pendiente de configuración
                      </div>
                    )}

                    <Link
                      href="/checkout"
                      onClick={() => track("checkout_started", { itemCount: totalItemCount, subtotal })}
                      className={`w-full btn btn-lg inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-all text-center ${
                        allInStock && !checkingStock
                          ? "bg-ivory text-plum-ink hover:bg-ivory/90 active:scale-95 shadow-md"
                          : "bg-ivory/10 text-ivory/30 cursor-not-allowed"
                      }`}
                    >
                      {checkingStock
                        ? "Verificando inventario..."
                        : allInStock
                          ? "💳 Pago con Tarjeta"
                          : "⚠️ Productos sin inventario"}
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-7 pt-5 border-t border-ivory/10 space-y-2 text-[0.65rem] text-ivory/50">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
                      100% Cosmética Coreana Original
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blush shrink-0" />
                      Envíos rápidos a todo México
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                      Instrucciones personalizadas de uso
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}