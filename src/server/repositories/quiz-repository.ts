import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { quizQuestions } from "@/lib/db/schema";

export async function getActiveQuizQuestions() {
  const questions = await db.query.quizQuestions.findMany({
    where: eq(quizQuestions.active, true),
    orderBy: (q, { asc }) => [asc(q.order)],
    with: { options: true },
  });
  return questions;
}
