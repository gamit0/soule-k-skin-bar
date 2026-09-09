// Tipos compartidos entre client/server. Se irán agregando por fase.
// Fase 3 agregará tipos de Product/Cocktail derivados del schema de Drizzle
// (InferSelectModel) en lugar de redefinirlos a mano aquí.

export type SkinType =
  | "dry"
  | "oily"
  | "combination"
  | "normal"
  | "sensitive";

export type Concern =
  | "acne"
  | "darkSpots"
  | "dehydration"
  | "aging"
  | "texture"
  | "dullness"
  | "pores"
  | "oiliness";
