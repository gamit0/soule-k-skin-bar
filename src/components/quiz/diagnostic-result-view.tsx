"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Shot, Cocktail, Product, SkinMood } from "@/types";
import { AddShotToCartButton } from "@/components/cart/add-shot-to-cart-button";
import { generateWhatsAppCheckoutUrl } from "@/server/services/whatsapp-service";
import { track } from "@/lib/track";

export interface DiagnosticData {
  recommendationId?: string;
  primaryShot: Shot;
  secondaryShot?: Shot;
  recommendedCocktail: Cocktail;
  skinMood: SkinMood;
  matchScore: number;
  scoreBreakdown: Record<string, number>;
  amRoutine: Product[];
  pmRoutine: Product[];
  personalizedMessage: string;
}

/* ── Mood emoji map ──────────────────────────────────────────────────────── */
const MOOD_EMOJI: Record<string, string> = {
  Calm: "🌿",
  Glow: "✨",
  Clean: "🫧",
  Hydrated: "💧",
  Firm: "⚡",
};

/* ── Step icon map ───────────────────────────────────────────────────────── */
const STEP_ICONS: Record<string, string> = {
  cleanser: "🧴",
  toner: "💧",
  exfoliant: "✨",
  serum: "🧪",
  treatment: "💊",
  moisturizer: "🫧",
  eye_cream: "👁️",
  special_care: "⭐",
  sunscreen: "☀️",
};

export function DiagnosticResultView({
  initialData,
}: {
  initialData?: DiagnosticData | null;
}) {
  const [data, setData] = useState<DiagnosticData | null>(initialData || null);
  const [activeTab, setActiveTab] = useState<"routine" | "shot" | "cocktail">("routine");
  const { addItems } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    if (!data && typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem("soule_diagnostic_result");
      if (stored) {
        try {
          setData(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse diagnostic result from sessionStorage:", e);
        }
      }
    }
  }, [data]);

  // Fire shot_recommended analytics once this result is shown
  useEffect(() => {
    if (!data) return;
    track("shot_recommended", {
      shot: data.primaryShot.slug,
      cocktail: data.recommendedCocktail.slug,
      mood: data.skinMood,
      matchScore: data.matchScore,
    });
  }, [data]);

  // Animate match score counter on mount
  useEffect(() => {
    if (!data) return;
    const target = data.matchScore;
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), 600);
    return () => clearTimeout(timer);
  }, [data]);

  // Hide reveal animation after delay
  useEffect(() => {
    if (showReveal) {
      const timer = setTimeout(() => setShowReveal(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [showReveal]);

  /* ── Empty state ──────────────────────────────────────────────────────────── */
  if (!data) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center animate-fade-in">
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-wine/5 animate-pulse-soft" />
          <span className="relative text-5xl z-10">🍸</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-plum-ink">
          Tu Diagnóstico K-Beauty
        </h1>
        <p className="mt-3 text-sm text-plum-ink/60 max-w-sm mx-auto">
          No encontramos un diagnóstico activo en esta sesión. Realiza el quiz para recibir tu
          dosis personalizada.
        </p>
        <div className="mt-10">
          <Link href="/quiz" className="btn btn-primary btn-lg btn-arrow">
            Comenzar Skin Quiz
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    primaryShot,
    secondaryShot,
    recommendedCocktail,
    skinMood,
    matchScore,
    amRoutine,
    pmRoutine,
    personalizedMessage,
  } = data;

  // Combine unique routine products for full add-to-cart
  const allRoutineProducts = Array.from(
    new Map([...amRoutine, ...pmRoutine].map((p) => [p.id, p])).values()
  );
  const totalRoutinePrice = allRoutineProducts.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );

  const handleAddFullRoutine = () => {
    addItems(
      allRoutineProducts.map((p) => ({
        productId: p.id,
        name: p.name,
        price: Number(p.price),
      }))
    );
    track("added_to_cart", { source: "full_routine", count: allRoutineProducts.length });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  };

  const whatsAppUrl = generateWhatsAppCheckoutUrl({
    diagnosticMood: skinMood,
    recommendedShotName: primaryShot.name,
    cocktailName: recommendedCocktail.name,
    products: allRoutineProducts.map((p) => ({
      name: p.name,
      brand: p.brand,
      price: p.price,
    })),
    total: totalRoutinePrice,
  });

  /* ── Reveal animation overlay ──────────────────────────────────────────── */
  if (showReveal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum-ink">
        <div className="text-center animate-fade-in">
          <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-wine/30 animate-spin-slower" />
            <div className="absolute inset-3 rounded-full border border-gold/20 animate-spin" style={{ animationDirection: "reverse", animationDuration: "6s" }} />
            <div className="absolute inset-6 rounded-full bg-wine/10 animate-pulse-soft" />
            <span className="relative text-6xl z-10">{MOOD_EMOJI[skinMood] || "✨"}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory animate-fade-in">
            {skinMood}
          </h2>
          <p className="mt-2 text-sm text-ivory/60 animate-fade-in" style={{ animationDelay: "300ms" }}>
            Tu piel ha hablado…
          </p>
        </div>
      </div>
    );
  }

  /* ── Main result UI ──────────────────────────────────────────────────────── */
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* ── Hero Card: Match Score + Shot Reveal ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum-ink via-plum-ink/95 to-wine p-8 sm:p-12 text-ivory shadow-xl">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-wine-rose/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-8">
          {/* Left: Shot info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow bg-ivory/15 text-blush border-0">
                <span className="eyebrow-dot bg-blush" aria-hidden="true" />
                Diagnóstico Oficial
              </span>
              <span className="chip bg-wine-rose/40 text-blush border-0 text-[0.65rem]">
                {MOOD_EMOJI[skinMood] || "✨"} {skinMood}
              </span>
            </div>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-balance">
              Tu Dosis Ideal
            </h1>
            <p className="mt-1 font-display text-2xl sm:text-3xl text-blush font-light">
              {primaryShot.name}
            </p>
            <p className="mt-2 text-sm text-ivory/70 font-light">
              {primaryShot.subtitle}
            </p>
          </div>

          {/* Right: Animated match score */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:border-l border-ivory/15 sm:pl-8">
            <span className="text-[0.65rem] uppercase tracking-widest text-ivory/50 font-medium">
              Afinidad Dérmica
            </span>
            <div className="relative">
              <span className="font-display text-5xl sm:text-6xl font-bold text-blush tabular-nums">
                {animatedScore}
              </span>
              <span className="font-display text-2xl text-blush/60">%</span>
            </div>
            <span className="text-[0.6rem] uppercase tracking-wider text-ivory/50">
              Scoring Clínico
            </span>
            {/* Score bar */}
            <div className="w-32 h-1.5 rounded-full bg-ivory/10 mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blush to-gold transition-all duration-1000 ease-out"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Personalized message */}
        <div className="relative mt-8 rounded-2xl bg-ivory/8 backdrop-blur-sm border border-ivory/10 p-5">
          <p className="text-sm sm:text-base leading-relaxed text-ivory/90 font-light italic">
            &ldquo;{personalizedMessage}&rdquo;
          </p>
        </div>
      </div>

      {/* ── Tabs Navigation ────────────────────────────────────────────────────── */}
      <div className="mt-10 flex gap-2 border-b border-plum-ink/10 pb-0 overflow-x-auto">
        {[
          { key: "routine" as const, label: "🌅 Rutina AM / PM", count: `${amRoutine.length + pmRoutine.length} pasos` },
          { key: "shot" as const, label: `🧪 ${primaryShot.name}`, count: null },
          { key: "cocktail" as const, label: `🍸 ${recommendedCocktail.name}`, count: null },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-3 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "text-plum-ink"
                : "text-plum-ink/40 hover:text-plum-ink/70"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count && (
              <span className="ml-2 text-[0.65rem] text-plum-ink/40 font-normal">{tab.count}</span>
            )}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wine rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab 1: AM / PM Routine Timeline ──────────────────────────────────── */}
      {activeTab === "routine" && (
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          {/* AM */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">☀️</span>
                <h2 className="font-display text-xl text-plum-ink">
                  Rutina AM
                </h2>
              </div>
              <span className="chip chip-sage text-[0.6rem]">
                {amRoutine.length} pasos
              </span>
            </div>

            <div className="space-y-0">
              {amRoutine.map((p, idx) => (
                <div key={`am-${p.id}-${idx}`} className="relative flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/20 text-sm z-10">
                      {STEP_ICONS[p.routineStep] || "📋"}
                    </div>
                    {idx < amRoutine.length - 1 && (
                      <div className="w-px h-full bg-plum-ink/10 min-h-[24px]" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-plum-ink/40">
                          Paso {idx + 1} • {p.routineStep.replace("_", " ")}
                        </span>
                        <h4 className="text-sm font-semibold text-plum-ink mt-0.5">
                          {p.name}
                        </h4>
                        <span className="text-[0.65rem] text-plum-ink/50">
                          {p.brand}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-wine tabular-nums">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PM */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌙</span>
                <h2 className="font-display text-xl text-plum-ink">
                  Rutina PM
                </h2>
              </div>
              <span className="chip chip-lilac text-[0.6rem]">
                {pmRoutine.length} pasos
              </span>
            </div>

            <div className="space-y-0">
              {pmRoutine.map((p, idx) => (
                <div key={`pm-${p.id}-${idx}`} className="relative flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-ink/8 text-sm z-10">
                      {STEP_ICONS[p.routineStep] || "📋"}
                    </div>
                    {idx < pmRoutine.length - 1 && (
                      <div className="w-px h-full bg-plum-ink/10 min-h-[24px]" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-plum-ink/40">
                          Paso {idx + 1} • {p.routineStep.replace("_", " ")}
                        </span>
                        <h4 className="text-sm font-semibold text-plum-ink mt-0.5">
                          {p.name}
                        </h4>
                        <span className="text-[0.65rem] text-plum-ink/50">
                          {p.brand}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-wine tabular-nums">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Shot Details ────────────────────────────────────────────────── */}
      {activeTab === "shot" && (
        <div className="mt-8">
          <div className="rounded-3xl border border-plum-ink/10 bg-ivory p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-wine/10 text-3xl">
                {primaryShot.icon}
              </div>
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-dot" aria-hidden="true" />
                  {primaryShot.category}
                </span>
                <h3 className="mt-1 font-display text-2xl text-plum-ink">
                  {primaryShot.name}
                </h3>
                <p className="mt-0.5 text-sm text-plum-ink/60">
                  {primaryShot.subtitle}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-plum-ink/80">
              {primaryShot.description}
            </p>

            <div className="mt-6 border-t border-plum-ink/10 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-plum-ink/50">
                Productos incluidos
              </h4>
              <div className="mt-3 space-y-2">
                {primaryShot.products?.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl bg-blush/15 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {STEP_ICONS[p.routineStep] || "📦"}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-plum-ink block">
                          {p.name}
                        </span>
                        <span className="text-[0.65rem] text-plum-ink/50">
                          {p.brand}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-wine tabular-nums">
                      ${Number(p.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <AddShotToCartButton shot={primaryShot} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Cocktail Details ───────────────────────────────────────────── */}
      {activeTab === "cocktail" && (
        <div className="mt-8">
          <div className="rounded-3xl border border-plum-ink/10 bg-ivory p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-wine/10 text-3xl">
                {recommendedCocktail.icon || "🍸"}
              </div>
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-dot" aria-hidden="true" />
                  Cocktail Base
                </span>
                <h3 className="mt-1 font-display text-2xl text-plum-ink">
                  {recommendedCocktail.name}
                </h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-plum-ink/80">
              {recommendedCocktail.description}
            </p>

            <div className="mt-6 border-t border-plum-ink/10 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-plum-ink/50">
                Pasos del Cocktail
              </h4>
              <div className="mt-3 space-y-2">
                {recommendedCocktail.products?.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl bg-blush/15 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine/10 text-[0.6rem] font-bold text-wine">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-plum-ink block">
                          {p.name}
                        </span>
                        <span className="text-[0.65rem] text-plum-ink/50">
                          {p.brand}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-wine tabular-nums">
                      ${Number(p.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Secondary Shot recommendation ──────────────────────────────────────── */}
      {secondaryShot && (
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-blush/20 to-pearl border border-wine/15 p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-wine/10 text-2xl">
                {secondaryShot.icon}
              </div>
              <div>
                <span className="eyebrow text-wine">
                  <span className="eyebrow-dot bg-wine" aria-hidden="true" />
                  Potenciador Secundario
                </span>
                <h3 className="mt-1 font-display text-lg text-plum-ink">
                  {secondaryShot.name}
                </h3>
                <p className="mt-0.5 text-xs text-plum-ink/60">
                  Tu perfil también responde a este shot complementario.
                </p>
              </div>
            </div>
            <Link
              href={`/shots/${secondaryShot.slug}`}
              className="btn btn-outline btn-sm border-wine/30 text-wine hover:bg-wine hover:text-ivory self-start sm:self-center"
            >
              Ver Shot →
            </Link>
          </div>
        </div>
      )}

      {/* ── Global Purchase & WhatsApp CTAs ──────────────────────────────────── */}
      <div className="mt-12 rounded-3xl bg-gradient-to-br from-plum-ink via-plum-ink/95 to-wine p-8 sm:p-10 text-ivory shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[0.65rem] uppercase tracking-widest text-blush/70 font-semibold">
              Tu Rutina Completa
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-ivory tabular-nums">
                ${totalRoutinePrice.toFixed(2)}
              </span>
              <span className="text-xs text-ivory/50 font-light">MXN</span>
            </div>
            <p className="mt-1 text-xs text-ivory/60">
              {allRoutineProducts.length} productos • Envío e instrucciones incluidos
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddFullRoutine}
              className="btn btn-ivory btn-md btn-arrow cursor-pointer"
            >
              {addedAll ? "✓ ¡Añadido!" : "🛒 Añadir Rutina al Carrito"}
            </button>

            {whatsAppUrl && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_clicked", { source: "result_page" })}
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#1EBE5D] transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
              >
                💬 Pedir por WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 pt-6 border-t border-ivory/10 flex flex-wrap items-center gap-4 text-[0.65rem] text-ivory/50">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blush" aria-hidden="true" />
            Envío gratis +$1.200
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
            Asesoría personalizada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            100% Productos originales
          </span>
        </div>
      </div>
    </div>
  );
}