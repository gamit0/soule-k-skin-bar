"use client";

import { track } from "@/lib/track";

export function Hero() {
  return (
    <section className="px-6 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:items-end">
        <div>
          <p className="mb-5 text-sm text-wine">Soule K Skin Bar</p>
          <h1 className="max-w-lg font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-plum-ink sm:text-6xl">
            Your skin deserves its own cocktail.
          </h1>
          <p className="mt-6 max-w-sm text-plum-ink/70">
            Descubre una rutina creada para las necesidades únicas de tu
            piel. Un cocktail, no cientos de productos.
          </p>
          <a
            href="/quiz"
            onClick={() => track("quiz_started", { source: "hero" })}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark"
          >
            Descubre tu cocktail
          </a>
        </div>

        <div className="flex aspect-[4/5] items-end justify-center rounded-[2rem] bg-blush/40 p-8 sm:aspect-square">
          <p className="font-[family-name:var(--font-display)] text-3xl italic text-wine">
            &ldquo;No necesitas saber qué comprar.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
