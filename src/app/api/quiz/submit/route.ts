import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db/client";
import { quizResponses, recommendationResults, cocktails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { RuleBasedRecommendationEngine } from "@/server/services/rule-based-recommendation-engine";
import type { QuizAnswer } from "@/server/services/recommendation-engine";

const engine = new RuleBasedRecommendationEngine();

export async function POST(request: Request) {
  const body = await request.json();
  const answers: QuizAnswer[] = body.answers;
  const sessionId: string = body.sessionId ?? randomUUID();

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { error: "Faltan respuestas del quiz." },
      { status: 400 },
    );
  }

  try {
    const [response] = await db
      .insert(quizResponses)
      .values({ sessionId, answers })
      .returning();

    const result = await engine.recommend(answers);

    const [saved] = await db
      .insert(recommendationResults)
      .values({
        quizResponseId: response!.id,
        primaryCocktailId: result.primaryCocktailId,
        secondaryCocktailId: result.secondaryCocktailId,
        scoreBreakdown: result.scoreBreakdown,
      })
      .returning();

    const primaryCocktail = await db.query.cocktails.findFirst({
      where: eq(cocktails.id, result.primaryCocktailId),
    });

    return NextResponse.json({
      recommendationId: saved!.id,
      primaryCocktailSlug: primaryCocktail?.slug,
      scoreBreakdown: result.scoreBreakdown,
    });
  } catch (err) {
    console.error("[quiz/submit]", err);
    return NextResponse.json(
      { error: "No se pudo calcular tu recomendación. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
