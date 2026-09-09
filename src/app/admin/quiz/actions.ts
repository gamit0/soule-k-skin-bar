"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { quizQuestions, quizOptions, quizOptionWeights } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function createQuestion(formData: FormData) {
  await requireAdmin(["super_admin", "editor"]);
  const [question] = await db
    .insert(quizQuestions)
    .values({
      text: formData.get("text") as string,
      type: (formData.get("type") as string) || "single",
      order: Number(formData.get("order") ?? 0),
    })
    .returning();
  revalidatePath("/admin/quiz");
  return question;
}

export async function addOption(
  questionId: string,
  label: string,
  cocktailId: string,
  weight: number,
) {
  await requireAdmin(["super_admin", "editor"]);
  const [option] = await db
    .insert(quizOptions)
    .values({ questionId, label, value: label.toLowerCase() })
    .returning();

  if (cocktailId && weight) {
    await db.insert(quizOptionWeights).values({
      optionId: option!.id,
      cocktailId,
      weight,
    });
  }

  revalidatePath("/admin/quiz");
}
