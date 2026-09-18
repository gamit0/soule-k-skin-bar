import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { quizQuestions } from "@/lib/db/schema";
import { fallbackQuizQuestions } from "@/mock-data/quiz-fallback";
import { QuizQuestion } from "@/types";

export async function getActiveQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const questions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.active, true),
      orderBy: (q, { asc }) => [asc(q.order)],
      with: { options: true },
    });

    if (questions && questions.length > 0) {
      return questions.map((q) => ({
        ...q,
        type: q.type as "single" | "multi",
      })) as QuizQuestion[];
    }
  } catch (err) {
    console.warn("[quiz-repository] DB fetch failed, falling back to fallbackQuizQuestions:", err);
  }

  return fallbackQuizQuestions.filter((q) => q.active);
}
