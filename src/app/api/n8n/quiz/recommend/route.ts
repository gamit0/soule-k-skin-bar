import { NextResponse } from "next/server";
import { RuleBasedRecommendationEngine } from "@/server/services/rule-based-recommendation-engine";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";
import type { QuizAnswer } from "@/types";

const engine = new RuleBasedRecommendationEngine();

type RecommendBody = {
  answers: QuizAnswer[];
};

export async function POST(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const body: RecommendBody = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Faltan respuestas del quiz." },
        { status: 400 }
      );
    }

    // Calculate deterministic recommendation using the same engine as the website
    const result = await engine.recommend(answers);

    return NextResponse.json({
      primaryShot: {
        id: result.primaryShot.id,
        slug: result.primaryShot.slug,
        name: result.primaryShot.name,
        menuTitle: result.primaryShot.menuTitle,
        subtitle: result.primaryShot.subtitle,
        category: result.primaryShot.category,
        description: result.primaryShot.description,
        icon: result.primaryShot.icon,
        mood: result.primaryShot.mood,
        concerns: result.primaryShot.concerns,
        skinTypes: result.primaryShot.skinTypes,
        productIds: result.primaryShot.productIds,
        active: result.primaryShot.active,
      },
      secondaryShot: result.secondaryShot ? {
        id: result.secondaryShot.id,
        slug: result.secondaryShot.slug,
        name: result.secondaryShot.name,
        menuTitle: result.secondaryShot.menuTitle,
        subtitle: result.secondaryShot.subtitle,
        category: result.secondaryShot.category,
        description: result.secondaryShot.description,
        icon: result.secondaryShot.icon,
        mood: result.secondaryShot.mood,
        concerns: result.secondaryShot.concerns,
        skinTypes: result.secondaryShot.skinTypes,
        productIds: result.secondaryShot.productIds,
        active: result.secondaryShot.active,
      } : null,
      recommendedCocktail: {
        id: result.recommendedCocktail.id,
        slug: result.recommendedCocktail.slug,
        name: result.recommendedCocktail.name,
        menuTitle: result.recommendedCocktail.menuTitle,
        subtitle: result.recommendedCocktail.subtitle,
        icon: result.recommendedCocktail.icon,
        image: result.recommendedCocktail.image,
        description: result.recommendedCocktail.description,
        shortDescription: result.recommendedCocktail.shortDescription,
        mood: result.recommendedCocktail.mood,
        concerns: result.recommendedCocktail.concerns,
        skinTypes: result.recommendedCocktail.skinTypes,
        active: result.recommendedCocktail.active,
      },
      skinMood: result.skinMood,
      matchScore: result.matchScore,
      scoreBreakdown: result.scoreBreakdown,
      amRoutine: result.amRoutine.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        price: Number(p.price),
        routineStep: p.routineStep,
        usage: p.usage,
        image: p.image,
      })),
      pmRoutine: result.pmRoutine.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        price: Number(p.price),
        routineStep: p.routineStep,
        usage: p.usage,
        image: p.image,
      })),
      personalizedMessage: result.personalizedMessage,
    });
  } catch (err: any) {
    console.error("[n8n/quiz/recommend] Error:", err);
    return NextResponse.json(
      { error: err?.message || "No se pudo calcular la recomendación." },
      { status: 500 }
    );
  }
}