// Datos de prueba — NO representan cocktails reales del catálogo final.
// El admin panel (Fase 8) reemplazará esto por datos gestionados en DB.

export type MockCocktail = {
  slug: string;
  name: string;
  shortDescription: string;
  concerns: string[];
};

export const mockCocktails: MockCocktail[] = [
  {
    slug: "hydration",
    name: "Hydration",
    shortDescription: "Para piel deshidratada que pide agua, no solo aceite.",
    concerns: ["dehydration"],
  },
  {
    slug: "acne",
    name: "Acne",
    shortDescription: "Controla brotes sin resecar de más.",
    concerns: ["acne"],
  },
  {
    slug: "anti-age",
    name: "Anti-Age",
    shortDescription: "Firmeza y prevención para líneas de expresión.",
    concerns: ["aging"],
  },
  {
    slug: "glow",
    name: "Glow",
    shortDescription: "Luminosidad pareja, piel con brillo natural.",
    concerns: ["dullness"],
  },
  {
    slug: "dark-spots",
    name: "Dark Spots",
    shortDescription: "Ataca manchas e hiperpigmentación.",
    concerns: ["darkSpots"],
  },
  {
    slug: "sensitive-skin",
    name: "Sensitive Skin",
    shortDescription: "Calma, sin fragancias agresivas ni irritación.",
    concerns: ["dehydration"],
  },
  {
    slug: "oil-control",
    name: "Oil Control",
    shortDescription: "Equilibra el exceso de grasa sin dejar la piel tirante.",
    concerns: ["oiliness"],
  },
  {
    slug: "texture",
    name: "Texture",
    shortDescription: "Piel más lisa, poros afinados.",
    concerns: ["texture"],
  },
];
