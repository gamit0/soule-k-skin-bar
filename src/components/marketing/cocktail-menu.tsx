"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mockCocktails } from "@/mock-data/cocktails";
import { track } from "@/lib/track";

const MOOD_ACCENT: Record<string, { chip: string; bg: string; glow: string }> = {
  Calm: { chip: "chip-lilac", bg: "bg-lilac-light/30", glow: "bg-lilac/20" },
  Glow: { chip: "chip-gold", bg: "bg-gold-light/30", glow: "bg-gold/20" },
  Clean: { chip: "chip-sage", bg: "bg-sage-light/30", glow: "bg-sage/20" },
  Hydrated: { chip: "chip-aqua", bg: "bg-aqua-light/30", glow: "bg-aqua/20" },
  Firm: { chip: "chip-blush", bg: "bg-blush-light/30", glow: "bg-wine-rose/15" },
};

const DEFAULT_ACCENT = MOOD_ACCENT.Calm ?? { chip: "chip-lilac", bg: "bg-lilac-light/30", glow: "bg-lilac/20" };

const ICON_BG: Record<string, string> = {
  Calm: "bg-gradient-to-br from-lilac-light/50 to-lilac/20",
  Glow: "bg-gradient-to-br from-gold-light/50 to-gold/20",
  Clean: "bg-gradient-to-br from-sage-light/50 to-sage/20",
  Hydrated: "bg-gradient-to-br from-aqua-light/50 to-aqua/20",
  Firm: "bg-gradient-to-br from-blush-light/50 to-wine-rose/20",
};

const DEFAULT_ICON_BG = ICON_BG.Calm ?? "bg-gradient-to-br from-lilac-light/50 to-lilac/20";

export function CocktailMenu() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="shots" className="shell section" aria-labelledby="shots-heading">
      <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-up">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Menú de Dosis Focalizadas
        </p>
        <h2 id="shots-heading" className="mt-3 font-display text-4xl leading-tight text-plum-ink sm:text-5xl lg:text-6xl">
          ¿Qué necesita tu piel hoy?
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-base text-plum-ink/70 sm:text-lg">
          Cada Shot es una rutina completa de alta potencia, diseñada
          específicamente para resolver una necesidad concreta de tu piel sin
          saturar tu día a día.
        </p>
      </div>

      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Shots disponibles"
      >
        {mockCocktails.map((cocktail, i) => {
          const mood = cocktail.mood ?? "Calm";
          const accent = MOOD_ACCENT[mood] ?? DEFAULT_ACCENT;
          const iconBg = ICON_BG[mood] ?? DEFAULT_ICON_BG;
          const products = cocktail.products ?? [];

          return (
            <article
              key={cocktail.slug}
              className={`card card-hover group relative overflow-hidden animate-fade-up ${accent.bg}`}
              style={{ transitionDelay: `${mounted ? 100 + i * 80 : 0}ms` }}
              role="listitem"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wine/30 to-transparent" />

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div
                    className={`flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
                    aria-hidden="true"
                  >
                    <span className="text-2xl sm:text-3xl" role="img" aria-label={cocktail.name}>
                      {cocktail.icon}
                    </span>
                  </div>
                  <span className={`chip shrink-0 self-start ${accent.chip}`}>
                    {cocktail.mood}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-plum-ink group-hover:text-wine transition-colors duration-300 mb-2">
                  {cocktail.name}
                </h3>
                <p className="text-sm font-medium text-wine mb-4">
                  {cocktail.shortDescription || cocktail.subtitle || "Ver detalles del Shot"}
                </p>

                <p className="text-sm text-plum-ink/70 leading-relaxed line-clamp-3 mb-6">
                  {cocktail.description}
                </p>

                <div className="pt-4 border-t border-plum-ink/5 mb-6">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-plum-ink/40 mb-2">
                    Fórmula ({products.length} pasos):
                  </p>
                  <ul className="space-y-1.5 max-h-32 overflow-hidden">
                    {products.slice(0, 4).map((p) => (
                      <li key={p.id} className="text-xs text-plum-ink/80 truncate flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-wine/20 shrink-0" aria-hidden="true" />
                        <span className="font-medium text-plum-ink">{p.brand}</span>
                        <span aria-hidden="true">—</span>
                        <span>{p.name}</span>
                      </li>
                    ))}
                    {products.length > 4 && (
                      <li className="text-xs text-plum-ink/50 italic">
                        +{products.length - 4} más
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-plum-ink/5">
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] uppercase tracking-wider text-plum-ink/50">
                      Precio del Shot
                    </span>
                    <span className="font-display text-2xl font-bold text-wine">
                      ${cocktail.totalPrice?.toFixed(2)}
                      <span className="text-xs font-light text-plum-ink/60"> MXN</span>
                    </span>
                  </div>
                  <Link
                    href={`/cocktails/${cocktail.slug}`}
                    onClick={() => track("shot_viewed", { shot: cocktail.slug })}
                    className="btn btn-primary btn-sm btn-arrow shrink-0"
                    aria-label={`Ver detalles de ${cocktail.name}`}
                  >
                    Ver Shot
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className={`absolute inset-0 ${accent.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />
            </article>
          );
        })}
      </div>

      <div className="mt-16 animate-fade-up" style={{ transitionDelay: `${mockCocktails.length * 80 + 200}ms` }}>
        <div className="pearl-panel rounded-3xl border border-plum-ink/10 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-light/10 via-transparent to-transparent" />
          <h2 className="font-display text-2xl sm:text-4xl text-plum-ink relative">
            ¿No sabes qué Shot necesita tu piel?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-plum-ink/70 max-w-xl mx-auto relative">
            Realiza nuestro diagnóstico interactivo K-Beauty en 2 minutos y
            descubre tu combinación exacta de Shot y Cocktail diario.
          </p>
          <div className="mt-8 relative">
            <Link
              href="/quiz"
              onClick={() => track("quiz_started", { source: "shots_cta" })}
              className="btn btn-ink btn-lg btn-arrow inline-flex"
            >
              Realizar Diagnóstico de Piel
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
