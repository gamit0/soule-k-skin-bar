import { db } from "@/lib/db/client";
import { mockShots } from "@/mock-data/shots";
import { mockCocktails } from "@/mock-data/cocktails";
import { fallbackQuizQuestions } from "@/mock-data/quiz-fallback";
import { mockProducts } from "@/mock-data/products";
import { resolveCocktailSlug } from "@/mock-data/shot-cocktail-map";
import type {
  QuizAnswer,
  Shot,
  Cocktail,
  Product,
  SkinMood,
  RecommendationResult,
} from "@/types";

const SECONDARY_THRESHOLD_RATIO = 0.55;

export interface DetailedRecommendation {
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

export class RuleBasedRecommendationEngine {
  async recommend(answers: QuizAnswer[]): Promise<DetailedRecommendation> {
    const selectedOptionIds = new Set(answers.flatMap((a) => a.optionIds));

    if (selectedOptionIds.size === 0) {
      throw new Error("No se recibieron respuestas para calcular el diagnóstico.");
    }

    // 1. Calculate Raw Scores from Fallback Weight Matrix (and DB if available)
    const shotScores: Record<string, number> = {};
    const moodScores: Record<string, number> = {
      Calm: 0,
      Glow: 0,
      Clean: 0,
      Hydrated: 0,
      Firm: 0,
    };

    // Initialize all mock shots with base score 0
    for (const s of mockShots) {
      shotScores[s.id] = 0;
      shotScores[s.slug] = 0;
    }

    // Accumulate weights from selected options
    for (const q of fallbackQuizQuestions) {
      for (const opt of q.options) {
        if (selectedOptionIds.has(opt.id) || selectedOptionIds.has(opt.value)) {
          if (opt.shotWeights) {
            for (const [sId, weight] of Object.entries(opt.shotWeights)) {
              shotScores[sId] = (shotScores[sId] ?? 0) + weight;
            }
          }
          if (opt.moodWeights) {
            for (const [mName, weight] of Object.entries(opt.moodWeights)) {
              moodScores[mName] = (moodScores[mName] ?? 0) + weight;
            }
          }
        }
      }
    }

    // 2. Select Primary and Secondary Shots
    const shotEntries = Object.entries(shotScores)
      .filter(([id]) => id.startsWith("shot-"))
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

    const firstShotEntry = shotEntries[0];
    const topShotId = firstShotEntry ? firstShotEntry[0] : "shot-hidra-power";
    const topShotScore = firstShotEntry ? firstShotEntry[1] : 10;
    const secondShotEntry = shotEntries.length > 1 ? shotEntries[1] : null;

    const primaryShot =
      mockShots.find((s) => s.id === topShotId || s.slug === topShotId) ??
      mockShots[3] ??
      mockShots[0]!;

    const secondaryShot =
      secondShotEntry && (secondShotEntry[1] ?? 0) >= topShotScore * SECONDARY_THRESHOLD_RATIO
        ? mockShots.find((s) => s.id === secondShotEntry[0] || s.slug === secondShotEntry[0])
        : undefined;

    // 3. Select Dominant Skin Mood
    const sortedMoods = Object.entries(moodScores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    const topMoodEntry = sortedMoods[0];
    const skinMood: SkinMood = (topMoodEntry && (topMoodEntry[1] ?? 0) > 0
      ? topMoodEntry[0]
      : primaryShot.mood) as SkinMood;

    // 4. Match Corresponding Cocktail / Routine
    // Usa la configuración explícita de src/mock-data/shot-cocktail-map.ts
    // (basada en SOULE_SKIN_MENU_2026_FINAL.pdf). Sin reglas if/else hardcoded.
    const targetCocktailSlug = resolveCocktailSlug(primaryShot.id, skinMood);
    const recommendedCocktail =
      mockCocktails.find((c) => c.slug === targetCocktailSlug) ??
      mockCocktails[1] ??
      mockCocktails[0]!;

    // 5. Score breakdown percentage
    const totalWeight = shotEntries.reduce((sum, [, val]) => sum + (val ?? 0), 0) || 1;
    const scoreBreakdown: Record<string, number> = {};
    for (const [id, val] of shotEntries) {
      scoreBreakdown[id] = Math.round(((val ?? 0) / totalWeight) * 100);
    }
    const matchScore = Math.min(99, Math.max(88, Math.round(85 + (topShotScore / (totalWeight || 1)) * 14)));

    // 6. Build AM / PM Routine
    const shotProducts = primaryShot.products ?? [];
    const cocktailProducts = recommendedCocktail.products ?? [];

    // Combine and classify routine products
    const amRoutine: Product[] = [];
    const pmRoutine: Product[] = [];

    // Add cocktail base steps (Cleanser, Toner, SPF)
    for (const p of cocktailProducts) {
      if (p.usage === "AM" || p.usage === "BOTH") {
        if (!amRoutine.some((x) => x.id === p.id)) amRoutine.push(p);
      }
      if (p.usage === "PM" || p.usage === "BOTH") {
        if (!pmRoutine.some((x) => x.id === p.id)) pmRoutine.push(p);
      }
    }

    // Add Shot treatment products
    for (const p of shotProducts) {
      if (p.usage === "AM" || p.usage === "BOTH") {
        if (!amRoutine.some((x) => x.id === p.id)) amRoutine.splice(1, 0, p);
      }
      if (p.usage === "PM" || p.usage === "BOTH") {
        if (!pmRoutine.some((x) => x.id === p.id)) pmRoutine.splice(1, 0, p);
      }
    }

    // Personalized clinical summary
    const personalizedMessage = `Tu piel presenta un perfil orientado al Mood "${skinMood}". Tu barrera cutánea responderá de forma óptima a una dosis focalizada de ${primaryShot.name} (${primaryShot.subtitle}) para potenciar la hidratación celular y restaurar la luminosidad natural coreana.`;

    return {
      primaryShot,
      secondaryShot,
      recommendedCocktail,
      skinMood,
      matchScore,
      scoreBreakdown,
      amRoutine,
      pmRoutine,
      personalizedMessage,
    };
  }
}
