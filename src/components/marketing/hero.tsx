"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative overflow-hidden shell pt-20 pb-20 sm:pt-32 sm:pb-36"
      aria-labelledby="hero-heading"
    >
      {/* Animated aurora background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-blush)/0.25_0%,transparent_60%)] animate-aurora" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-lilac)/0.15_0%,transparent_60%)] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-gold)/0.04_0%,transparent_70%)] animate-float-slow" />
      </div>

      {/* Floating pearlescent orbs */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <span className="absolute top-20 left-10 h-6 w-6 rounded-full bg-gradient-to-tr from-gold-light/40 to-transparent blur-xl animate-float" />
        <span className="absolute top-1/3 right-16 h-4 w-4 rounded-full bg-gradient-to-tr from-aqua-light/60 to-transparent blur-lg animate-[float_8s_ease-in-out_infinite]" />
        <span className="absolute bottom-20 left-1/4 h-5 w-5 rounded-full bg-gradient-to-tr from-lilac-light/50 to-transparent blur-xl animate-[float_9s_ease-in-out_infinite]" />
        <span className="absolute bottom-24 right-20 h-3 w-3 rounded-full bg-gradient-to-tr from-sage-light/60 to-transparent blur-lg animate-[float_7s_ease-in-out_infinite]" />
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left: copy */}
        <div className="flex flex-col justify-center animate-fade-up" style={{ transitionDelay: "100ms" }}>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Soule K Skin Bar
          </p>

          <h1
            id="hero-heading"
            className="mt-4 max-w-xl font-display text-4xl leading-[1.05] tracking-tight text-plum-ink sm:text-5xl lg:text-6xl"
          >
            Tu piel primero.<br />
            <span className="italic text-wine">Tu Shot ideal después.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-plum-ink/70 sm:text-lg">
            Descubre una rutina creada para las necesidades únicas de tu piel.
            Un Shot curado con activos coreanos puros — no cientos de productos
            genéricos.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/quiz"
              onClick={() => track("quiz_started", { source: "hero" })}
              className="btn btn-primary btn-lg btn-arrow w-full sm:w-auto"
            >
              <span>Descubrir mi Shot</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link
              href="#como-funciona"
              className="btn btn-outline btn-lg w-full sm:w-auto"
            >
              Cómo funciona
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-[0.75rem] text-plum-ink/55">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-blush/60" aria-hidden="true" />
              100% K-Beauty original
            </span>
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-light/80" aria-hidden="true" />
              Envío gratis +$1.200
            </span>
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-lilac-light/80" aria-hidden="true" />
              Asesoría incluida
            </span>
          </div>
        </div>

        {/* Right: visual hero card */}
        <div className="relative animate-fade-up" style={{ transitionDelay: "200ms" }}>
          <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-gradient-to-br from-blush/30 via-blush/10 to-lilac-light/20 p-1 shadow-soft ring-1 ring-plum-ink/5">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

            <div className="relative h-full w-full flex flex-col items-center justify-center rounded-[2.5rem] bg-ivory/80 backdrop-blur-xl p-8 sm:p-14 text-center">
              {/* Floating icon */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blush/30 to-wine/10 mb-8 animate-float">
                <span className="text-5xl animate-pulse-soft">🧪</span>
              </div>

              <blockquote className="font-display text-2xl leading-tight text-wine sm:text-3xl lg:text-4xl max-w-xs">
                &ldquo;No necesitas saber qué comprar,
                <br />
                <span className="italic">nosotros lo diseñamos por ti.</span>&rdquo;
              </blockquote>

              {/* Subtle shimmer line */}
              <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent animate-shimmer" />

              <p className="mt-6 text-sm text-plum-ink/60">
                Diagnóstico inteligente → Rutina curada → Resultados visibles
              </p>
            </div>

            {/* Corner accent mark */}
            <div className="absolute bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-2xl" />
          </div>

          {/* Floating ingredient badges around the card */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <span className="absolute top-4 left-2 chip chip-lilac animate-float">Niacinamida</span>
            <span className="absolute top-20 right-0 chip chip-sage animate-[float_8s_ease-in-out_infinite]">Ácido Hialurónico</span>
            <span className="absolute bottom-20 left-0 chip chip-blush animate-[float_9s_ease-in-out_infinite]">Centella Asiática</span>
            <span className="absolute bottom-4 right-2 chip chip-gold animate-[float_7s_ease-in-out_infinite]">Retinal</span>
          </div>
        </div>
      </div>
    </section>
  );
}