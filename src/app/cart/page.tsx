"use client";

import { useCart } from "@/lib/cart-context";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal } = useCart();

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Tu carrito
          </h1>

          {items.length === 0 ? (
            <p className="mt-8 text-plum-ink/60">
              Tu carrito está vacío.{" "}
              <a href="/quiz" className="text-wine">
                Descubre tu cocktail
              </a>
              .
            </p>
          ) : (
            <>
              <ul className="mt-8 divide-y divide-plum-ink/10 border-t border-plum-ink/10">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="text-plum-ink">{item.name}</p>
                      <p className="text-sm text-plum-ink/50">
                        ${item.price} MXN
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.productId, Number(e.target.value))
                        }
                        className="w-14 rounded border border-plum-ink/15 px-2 py-1 text-center"
                      />
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-sm text-plum-ink/40 hover:text-wine"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-plum-ink/70">Subtotal</p>
                <p className="text-lg text-plum-ink">${subtotal} MXN</p>
              </div>

              <a
                href="/checkout"
                className="mt-8 inline-flex rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark"
              >
                Ir a pagar
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
