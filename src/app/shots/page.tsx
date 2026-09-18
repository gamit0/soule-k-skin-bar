import Link from "next/link";
import type { Metadata } from "next";
import { getActiveShots } from "@/server/repositories/shot-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Shots K-Beauty",
  description:
    "Shots de skincare: tratamientos de alta potencia con activos coreanos puros para resolver necesidades puntuales de tu piel sin saturar tu rutina.",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Anti-Age": "⚡",
  Acné: "🫧",
  Hidratación: "💧",
  "Piel Grasa": "🍃",
  "Puntos Negros": "✨",
  "Piel sensible": "🌿",
};

export default async function ShotsMenuPage() {
  const shots = await getActiveShots();

  return (
    <>
      <Header />
      <main className="shell section min-h-screen">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Menú de Dosis Focalizadas
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-plum-ink font-normal text-balance">
              Shots K-Beauty
            </h1>
            <p className="mt-4 text-base sm:text-lg text-plum-ink/70 leading-relaxed max-w-2xl mx-auto">
              Tratamientos de alta potencia con activos coreanos puros, diseñados
              para solucionar necesidades específicas sin saturar tu rutina.
            </p>
          </div>

          {/* Grid of Shots */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shots.map((shot, i) => {
              const products = shot.products ?? [];
              return (
                <Link
                  key={shot.id}
                  href={`/shots/${shot.slug}`}
                  className="group card card-hover flex flex-col justify-between overflow-hidden animate-fade-up"
                  style={{ transitionDelay: `${100 + i * 80}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-wine/40 to-blush/60" />

                  <div className="p-6 sm:p-7">
                    {/* Icon + Category */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wine/8 text-2xl group-hover:bg-wine/12 transition-colors">
                        {shot.icon}
                      </div>
                      <span className="chip chip-wine text-[0.6rem]">
                        {CATEGORY_EMOJI[shot.category] || "🎯"} {shot.category}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-xl font-normal text-plum-ink group-hover:text-wine transition-colors">
                      {shot.name}
                    </h2>
                    <p className="mt-0.5 text-sm font-medium text-wine/80">
                      {shot.subtitle}
                    </p>

                    <p className="mt-3 text-sm text-plum-ink/65 line-clamp-3 leading-relaxed">
                      {shot.description}
                    </p>

                    {/* Products list */}
                    <div className="mt-5 pt-4 border-t border-plum-ink/8">
                      <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-plum-ink/40">
                        Fórmula ({products.length} productos)
                      </span>
                      <ul className="mt-2 space-y-1">
                        {products.slice(0, 3).map((p) => (
                          <li key={p.id} className="text-xs text-plum-ink/70 truncate flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-wine/30 shrink-0" />
                            <span className="font-medium text-plum-ink">{p.brand}</span>
                            <span className="truncate">{p.name}</span>
                          </li>
                        ))}
                        {products.length > 3 && (
                          <li className="text-[0.65rem] text-wine/60 font-medium pl-2.5">
                            +{products.length - 3} más…
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-4 border-t border-plum-ink/8 flex items-center justify-between">
                    <div>
                      <span className="text-[0.6rem] uppercase tracking-wider text-plum-ink/40 block">
                        Precio Shot
                      </span>
                      <span className="font-display text-xl font-bold text-wine">
                        ${shot.totalPrice?.toFixed(2)}
                        <span className="text-xs font-light text-plum-ink/50 ml-1">MXN</span>
                      </span>
                    </div>
                    <span className="btn btn-primary btn-sm group-hover:shadow-glow">
                      Ver Shot →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quiz CTA */}
          <div className="mt-20 rounded-3xl bg-gradient-to-br from-plum-ink via-plum-ink/95 to-wine p-8 sm:p-12 lg:p-16 text-center text-ivory relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-wine-rose/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
            </div>

            <div className="relative">
              <p className="eyebrow text-blush">
                <span className="eyebrow-dot bg-blush" aria-hidden="true" />
                ¿No sabes qué Shot necesitas?
              </p>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl text-ivory">
                Realiza tu Diagnóstico K-Beauty
              </h2>
              <p className="mt-3 text-sm sm:text-base text-ivory/70 max-w-xl mx-auto">
                2 minutos. Descubre tu combinación exacta de Shot y Cocktail diario
                según el perfil de tu piel.
              </p>
              <div className="mt-8">
                <Link href="/quiz" className="btn btn-ivory btn-lg btn-arrow">
                  🧪 Empezar Diagnóstico
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}