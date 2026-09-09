"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

type QuizOption = { id: string; label: string; value: string };
type QuizQuestion = {
  id: string;
  text: string;
  type: string;
  options: QuizOption[];
};

export function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = questions[step];
  const isLast = step === questions.length - 1;
  const selected = question ? (answers[question.id] ?? []) : [];

  function toggleOption(optionId: string) {
    if (!question) return;
    const isMulti = question.type === "multi";
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      if (isMulti) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }

  async function handleNext() {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

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

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal.");
        return;
      }

      track("quiz_completed");
      track("recommendation_received", { cocktail: data.primaryCocktailSlug });
      router.push(`/cocktails/${data.primaryCocktailSlug}`);
    } catch {
      setError("No pudimos conectar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!question) {
    return (
      <p className="text-plum-ink/60">
        El quiz todavía no tiene preguntas configuradas. Agrégalas desde el
        panel admin.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm text-plum-ink/50">
        Pregunta {step + 1} de {questions.length}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-plum-ink sm:text-3xl">
        {question.text}
      </h1>

      <ul className="mt-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => toggleOption(option.id)}
                className={`w-full rounded-xl border px-5 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-wine bg-blush/30 text-wine"
                    : "border-plum-ink/15 text-plum-ink hover:border-wine/50"
                }`}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>

      {error && <p className="mt-4 text-sm text-wine">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-plum-ink/50 disabled:opacity-0"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={selected.length === 0 || submitting}
          className="rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark disabled:opacity-40"
        >
          {isLast
            ? submitting
              ? "Calculando tu cocktail…"
              : "Ver mi cocktail"
            : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
