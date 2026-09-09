import { db } from "@/lib/db/client";
import type {
  RecommendationEngine,
  QuizAnswer,
  RecommendationResult,
} from "./recommendation-engine";

// Umbral mínimo (%) para que un cocktail secundario se muestre además del
// primario — evita combinaciones ruidosas con score irrelevante.
const SECONDARY_THRESHOLD_RATIO = 0.5;

/**
 * Motor de recomendación V1 (Fase 5): scoring determinístico por reglas.
 * Suma los pesos configurados en `quiz_option_weights` para cada opción
 * respondida, normaliza a porcentaje, y elige cocktail primario/secundario.
 *
 * Este es el motor que la IA (Fase 11) envolverá — nunca lo reemplaza.
 */
export class RuleBasedRecommendationEngine implements RecommendationEngine {
  async recommend(answers: QuizAnswer[]): Promise<RecommendationResult> {
    const optionIds = answers.flatMap((a) => a.optionIds);

    if (optionIds.length === 0) {
      throw new Error("No se recibieron respuestas para calcular el score.");
    }

    const weights = await db.query.quizOptionWeights.findMany({
      where: (w, { inArray }) => inArray(w.optionId, optionIds),
    });

    const rawScores: Record<string, number> = {};
    for (const w of weights) {
      rawScores[w.cocktailId] = (rawScores[w.cocktailId] ?? 0) + w.weight;
    }

    const entries = Object.entries(rawScores);
    if (entries.length === 0) {
      throw new Error(
        "No hay reglas de scoring configuradas para estas respuestas. Revisa quiz_option_weights en el admin.",
      );
    }

    const maxPossible = entries.reduce((sum, [, v]) => sum + v, 0);
    const scoreBreakdown: Record<string, number> = {};
    for (const [cocktailId, value] of entries) {
      scoreBreakdown[cocktailId] = Math.round((value / maxPossible) * 100);
    }

    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const [primaryCocktailId, primaryScore] = sorted[0]!;
    const second = sorted[1];

    const secondaryCocktailId =
      second && second[1] >= primaryScore * SECONDARY_THRESHOLD_RATIO
        ? second[0]
        : undefined;

    return {
      primaryCocktailId,
      secondaryCocktailId,
      scoreBreakdown,
    };
  }
}
