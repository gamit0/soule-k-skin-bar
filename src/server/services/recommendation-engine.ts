/**
 * Motor de recomendación. La V1 (Fase 5) es scoring determinístico por
 * reglas/pesos. La IA (Fase 11) implementará esta misma interfaz pero
 * envolviendo el resultado del scoring — nunca inventará cocktails ni
 * productos fuera de lo que este motor ya calculó.
 */
export interface QuizAnswer {
  questionId: string;
  optionIds: string[];
}

export interface ScoreBreakdown {
  [cocktailId: string]: number; // 0-100
}

export interface RecommendationResult {
  primaryCocktailId: string;
  secondaryCocktailId?: string;
  scoreBreakdown: ScoreBreakdown;
}

export interface RecommendationEngine {
  recommend(answers: QuizAnswer[]): Promise<RecommendationResult>;
}
