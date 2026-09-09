"use client";

// Estructura lista para el feed de Instagram (Fase 12+, vía API o embed).
// Por ahora es un placeholder visual, no contenido inventado.

import { track } from "@/lib/track";

export function SocialProof() {
  return (
    <section className="border-t border-plum-ink/10 px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink sm:text-4xl">
            Síguenos
          </h2>
          <a
            href="https://instagram.com"
            onClick={() => track("instagram_click")}
            className="text-sm text-wine hover:text-wine-dark"
          >
            @soulekskinbar
          </a>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-blush/25" />
          ))}
        </div>
      </div>
    </section>
  );
}
