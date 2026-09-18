import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db/client";
import { quizResponses, recommendationResults, cocktails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { RuleBasedRecommendationEngine } from "@/server/services/rule-based-recommendation-engine";
import type { QuizAnswer } from "@/types";

const engine = new RuleBasedRecommendationEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers: QuizAnswer[] = body.answers;
    const sessionId: string = body.sessionId ?? randomUUID();

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Faltan respuestas del quiz." },
        { status: 400 },
      );
    }

    // Calculate deterministic recommendation
    const result = await engine.recommend(answers);
    const recommendationId = randomUUID();

    // Try saving to DB if connection is live, but do not fail if offline
    try {
      const [response] = await db
        .insert(quizResponses)
        .values({ sessionId, answers })
        .returning();

      if (response) {
        await db
          .insert(recommendationResults)
          .values({
            id: recommendationId,
            quizResponseId: response.id,
            primaryCocktailId: result.recommendedCocktail.id,
            scoreBreakdown: result.scoreBreakdown,
          })
          .returning();
      }
    } catch (dbErr) {
      console.warn("[quiz/submit] Database persistence skipped/failed:", dbErr);
    }

    return NextResponse.json({
      recommendationId,
      primaryShot: result.primaryShot,
      primaryShotSlug: result.primaryShot.slug,
      secondaryShot: result.secondaryShot,
      secondaryShotSlug: result.secondaryShot?.slug,
      recommendedCocktail: result.recommendedCocktail,
      primaryCocktailSlug: result.recommendedCocktail.slug,
      skinMood: result.skinMood,
      matchScore: result.matchScore,
      scoreBreakdown: result.scoreBreakdown,
      amRoutine: result.amRoutine,
      pmRoutine: result.pmRoutine,
      personalizedMessage: result.personalizedMessage,
    });
  } catch (err: any) {
    console.error("[quiz/submit]", err);
    return NextResponse.json(
      { error: err?.message || "No se pudo calcular tu recomendación. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
