"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";
import { QuizQuestion, QuizOption } from "@/types";

export function useQuiz(questions: QuizQuestion[]) {
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

    const qId = question.id;
    const isMulti = question.type === "multi";

    setAnswers((prev) => {
      const current = prev[qId] || [];
      let next;

      if (isMulti) {
        next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      } else {
        next = [optionId];
      }

      return {
        ...prev,
        [qId]: next,
      };
    });
  }

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

      if (!res.ok) {
        throw new Error(data.error ?? "Algo salió mal.");
      }

      track("quiz_completed");
      track("recommendation_received", { cocktail: data.primaryCocktailSlug });
      router.push(`/cocktails/${data.primaryCocktailSlug}`);
    } catch (e: any) {
      setError(e.message || "No pudimos conectar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    step,
    setStep,
    question,
    selected,
    toggleOption,
    submitQuiz,
    submitting,
    error,
    isLast,
  };
}
