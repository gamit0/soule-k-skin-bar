"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizQuestion } from "@/types";
import { track } from "@/lib/track";

const LOADING_STEPS = [
  "Analizando tu tipo de piel y necesidades…",
  "Calibrando dosis de activos y extractos K-Beauty…",
  "Seleccionando tu Shot de alta potencia…",
  "Generando tu rutina personalizada AM & PM…",
];

export function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const question = questions[step];
  const isLast = step === questions.length - 1;
  const selected = question ? (answers[question.id] || []) : [];
  const progressPct = ((step + 1) / questions.length) * 100;

  // Fire quiz_started once per browser session when landing directly on /quiz
  // (CTAs already fire it with their source; this covers direct visits).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "soule_quiz_started";
    const started = window.sessionStorage.getItem(key);
    if (!started) {
      track("quiz_started", { source: "direct" });
      window.sessionStorage.setItem(key, "1");
    }
  }, []);

  // Animate loading messages during calculation
  useEffect(() => {
    if (!submitting) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [submitting]);

  const handleToggle = (optionId: string) => {
    if (!question) return;

    setAnswers((prev) => {
      const qId = question.id;
      const current = prev[qId] || [];
      const isMulti = question.type === "multi";

      if (isMulti) {
        const exists = current.includes(optionId);
        if (exists) {
          return { ...prev, [qId]: current.filter((id) => id !== optionId) };
        } else {
          if (current.length >= 2) {
            return { ...prev, [qId]: [...current.slice(1), optionId] };
          }
          return { ...prev, [qId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [qId]: [optionId] };
      }
    });
  };

  async function submitQuiz() {
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionIds]) => ({
          questionId,
          optionIds,
        })),
      };

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Algo salió mal.");

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("soule_diagnostic_result", JSON.stringify(data));
      }

      track("quiz_completed");
      track("recommendation_received", {
        shot: data.primaryShotSlug,
        cocktail: data.primaryCocktailSlug,
        mood: data.skinMood,
      });

      setTimeout(() => {
        router.push(
          `/quiz/resultado?shot=${data.primaryShotSlug}&cocktail=${data.primaryCocktailSlug}`
        );
      }, 800);
    } catch (e: any) {
      setError(e.message || "No pudimos conectar con el servidor.");
      setSubmitting(false);
    }
  }

  // Handle conditional questions
  useEffect(() => {
    if (question?.condition) {
      const { questionId, optionValue } = question.condition;
      const answerOptions = answers[questionId] || [];
      const optionsForConditionQuestion = questions.find((q) => q.id === questionId)?.options;
      const selectedValue = optionsForConditionQuestion?.find((o) => answerOptions.includes(o.id))?.value;

      if (selectedValue !== optionValue) {
        setStep((s) => s + 1);
      }
    }
  }, [step, question, answers, questions]);

  /* ── Submitting / Loading state ────────────────────────────────────────── */
  if (submitting) {
    return (
      <div className="mx-auto max-w-md py-20 text-center animate-fade-in">
        {/* Animated flask */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-wine/20 animate-spin-slower" />
          <div className="absolute inset-2 rounded-full border border-gold/30 animate-spin" style={{ animationDirection: "reverse", animationDuration: "8s" }} />
          {/* Pulse fill */}
          <div className="absolute inset-4 rounded-full bg-wine/10 animate-pulse-soft" />
          <div className="absolute inset-6 rounded-full bg-wine/5 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
          <span className="relative text-5xl z-10">🧪</span>
        </div>

        <h2 className="font-display text-3xl text-plum-ink">
          Preparando tu Dosis K-Beauty
        </h2>

        {/* Current step message */}
        <div className="mt-6 h-10 flex items-center justify-center">
          <p className="text-sm font-medium text-wine animate-fade-in" key={loadingStepIndex}>
            {LOADING_STEPS[loadingStepIndex]}
          </p>
        </div>

        {/* Shimmer bar */}
        <div className="mt-8 mx-auto h-1.5 w-56 overflow-hidden rounded-full bg-plum-ink/10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-wine/40 to-transparent animate-shimmer rounded-full"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>

        <p className="mt-6 text-xs text-plum-ink/50">
          Esto toma 2–3 segundos…
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-center">
        <p className="text-plum-ink/60">El diagnóstico no tiene preguntas configuradas.</p>
      </div>
    );
  }

  /* ── Main quiz UI ──────────────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Pregunta {step + 1} de {questions.length}
          </span>
          <span className="text-[0.72rem] font-semibold text-plum-ink/40">
            {Math.round(progressPct)}%
          </span>
        </div>

        {/* Premium progress bar */}
        <div className="progress-track relative overflow-visible">
          <div
            className="progress-fill rounded-full"
            style={{ width: `${progressPct}%` }}
          >
            {/* Shimmer on progress fill */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
          {/* Active dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-wine shadow-glow border-2 border-ivory transition-all duration-500"
            style={{ left: `calc(${progressPct}% - 6px)` }}
          />
        </div>
      </div>

      {/* Question */}
      <h1 className="font-display text-2xl sm:text-4xl leading-snug text-plum-ink font-normal text-balance">
        {question.title || question.text}
      </h1>
      {question.subtitle && (
        <p className="mt-2 text-sm text-plum-ink/65">
          {question.subtitle}
        </p>
      )}

      {/* Options */}
      <div className="mt-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id) || selected.includes(option.value);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.id)}
              className={`group relative flex w-full items-start gap-4 rounded-3xl border-2 p-5 sm:p-6 text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-wine bg-gradient-to-br from-blush/20 to-blush/5 shadow-glow"
                  : "border-plum-ink/10 bg-ivory hover:border-wine/30 hover:bg-blush/10 hover:shadow-soft"
              }`}
            >
              {/* Icon badge */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "bg-wine text-ivory scale-110"
                    : "bg-blush/30 text-plum-ink/70 group-hover:bg-blush/50 group-hover:scale-105"
                }`}
              >
                <span className="text-xl">{option.icon || "✨"}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-semibold text-plum-ink">
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wine text-[11px] text-ivory shadow-soft">
                      ✓
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-1.5 text-xs sm:text-sm text-plum-ink/65 leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>

              {/* Hover ring */}
              <div className="absolute inset-0 rounded-3xl ring-2 ring-wine/0 group-hover:ring-wine/10 transition-all pointer-events-none" />
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 animate-fade-up">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between pt-6 border-t border-plum-ink/10">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-xs font-semibold uppercase tracking-wider text-plum-ink/40 transition-colors hover:text-plum-ink disabled:opacity-0 cursor-pointer"
        >
          ← Anterior
        </button>

        <button
          type="button"
          onClick={isLast ? submitQuiz : () => setStep((s) => s + 1)}
          disabled={selected.length === 0 || submitting}
          className="btn btn-primary btn-md btn-arrow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLast ? (
            <>
              Revelar Diagnóstico
              <span className="arrow" aria-hidden="true">✨</span>
            </>
          ) : (
            <>
              Siguiente
              <span className="arrow" aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}