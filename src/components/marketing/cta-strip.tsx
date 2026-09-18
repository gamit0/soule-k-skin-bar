"use client";

import Link from "next/link";
import { track } from "@/lib/track";

export function CtaStrip() {
  return (
    <section className="shell section" aria-labelledby="cta-heading">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum-ink via-plum-ink/90 to-wine p-8 sm:p-12 lg:p-16 text-ivory">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-wine-rose/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gold-light/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow text-blush">
            <span className="eyebrow-dot bg-blush" aria-hidden="true" />
            ¿Lista para tu piel ideal?
          </p>

          <h2 id="cta-heading" className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Tu Shot te está esperando
          </h2>

          <p className="mt-4 text-base sm:text-lg text-ivory/80 max-w-lg mx-auto">
            Dos minutos. Un diagnóstico inteligente. Una rutina diseñada solo para
            ti.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              onClick={() => track("quiz_started", { source: "cta_strip" })}
              className="btn btn-ivory btn-lg btn-arrow w-full sm:w-auto"
            >
              Empezar mi diagnóstico
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link
              href="/shots"
              className="btn btn-outline btn-lg w-full sm:w-auto border-ivory/20 text-ivory hover:bg-ivory/10"
            >
              Ver menú de Shots
            </Link>
          </div>

          <p className="mt-8 text-sm text-ivory/60 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blush" aria-hidden="true" />
              Envío gratis +$1.200
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
              Asesoría incluida
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              100% Original
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}