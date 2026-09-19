import { db } from "@/lib/db/client";
import { quizQuestions, quizOptions, quizOptionWeights, shots, cocktails, cocktailProducts, products } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
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

function sanitizeProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description ?? undefined,
    shortDescription: p.shortDescription ?? undefined,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    categoryId: p.categoryId ?? undefined,
    skinTypes: p.skinTypes || [],
    concerns: p.concerns || [],
    ingredients: p.ingredients || [],
    benefits: p.benefits || [],
    routineStep: p.routineStep,
    usage: p.usage,
    stock: p.stock,
    active: p.active,
    image: p.images?.[0]?.url,
  };
}

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

    // 1. Load quiz questions with options and weights from DB
    const dbQuestions = await db.query.quizQuestions.findMany({
      where: (q, { eq }) => eq(q.active, true),
      orderBy: (q, { asc }) => [asc(q.order)],
      with: {
        options: {
          with: {
            weights: true,
          },
        },
      },
    });

    if (dbQuestions.length === 0) {
      throw new Error("No hay preguntas de quiz activas en la base de datos.");
    }

    // 2. Calculate Raw Scores from DB Weight Matrix
    const shotScores: Record<string, number> = {};
    const moodScores: Record<string, number> = {
      Calm: 0,
      Glow: 0,
      Clean: 0,
      Hydrated: 0,
      Firm: 0,
    };

    // Initialize all shots with base score 0
    const dbShots = await db.query.shots.findMany({
      where: (s, { eq }) => eq(s.active, true),
    });
    for (const s of dbShots) {
      shotScores[s.id] = 0;
      shotScores[s.slug] = 0;
    }

    // Accumulate weights from selected options
    for (const q of dbQuestions) {
      for (const opt of q.options) {
        if (selectedOptionIds.has(opt.id) || selectedOptionIds.has(opt.value)) {
          // Shot weights from DB
          for (const w of opt.weights) {
            shotScores[w.shotId] = (shotScores[w.shotId] ?? 0) + w.weight;
          }
        }
      }
    }

    // 3. Select Primary and Secondary Shots
    const shotEntries = Object.entries(shotScores)
      .filter(([id]) => id.startsWith("shot-"))
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

    const firstShotEntry = shotEntries[0];
    const topShotId = firstShotEntry ? firstShotEntry[0] : "shot-hidra-power";
    const topShotScore = firstShotEntry ? firstShotEntry[1] : 10;
    const secondShotEntry = shotEntries.length > 1 ? shotEntries[1] : null;

    const primaryShotDb = dbShots.find((s) => s.id === topShotId || s.slug === topShotId) ?? dbShots[0]!;

    const secondaryShotDb =
      secondShotEntry && (secondShotEntry[1] ?? 0) >= topShotScore * SECONDARY_THRESHOLD_RATIO
        ? dbShots.find((s) => s.id === secondShotEntry[0] || s.slug === secondShotEntry[0])
        : undefined;

    // 4. Select Dominant Skin Mood (from primary shot mood)
    const skinMood: SkinMood = (primaryShotDb.mood as SkinMood) ?? "Hydrated";

    // 5. Match Corresponding Cocktail / Routine
    const targetCocktailSlug = resolveCocktailSlug(primaryShotDb.id, skinMood);
    const dbCocktail = await db.query.cocktails.findFirst({
      where: (c, { eq }) => eq(c.slug, targetCocktailSlug),
      with: {
        productLinks: {
          with: { product: true },
        },
      },
    });

    const recommendedCocktail = dbCocktail ?? (await db.query.cocktails.findFirst({
      where: (c, { eq }) => eq(c.active, true),
      with: {
        productLinks: {
          with: { product: true },
        },
      },
    }))!;

    // Build Shot objects with full type compatibility
    const primaryShot: Shot = {
      id: primaryShotDb.id,
      slug: primaryShotDb.slug,
      name: primaryShotDb.name,
      menuTitle: primaryShotDb.menuTitle || primaryShotDb.name,
      subtitle: primaryShotDb.subtitle || "",
      category: primaryShotDb.category || "Personalized",
      description: primaryShotDb.description || "",
      icon: primaryShotDb.icon || "✨",
      mood: primaryShotDb.mood as SkinMood,
      concerns: primaryShotDb.concerns || [],
      skinTypes: primaryShotDb.skinTypes || [],
      productIds: [],
      active: primaryShotDb.active,
    };

    const secondaryShot: Shot | undefined = secondaryShotDb ? {
      id: secondaryShotDb.id,
      slug: secondaryShotDb.slug,
      name: secondaryShotDb.name,
      menuTitle: secondaryShotDb.menuTitle || secondaryShotDb.name,
      subtitle: secondaryShotDb.subtitle || "",
      category: secondaryShotDb.category || "Personalized",
      description: secondaryShotDb.description || "",
      icon: secondaryShotDb.icon || "✨",
      mood: secondaryShotDb.mood as SkinMood,
      concerns: secondaryShotDb.concerns || [],
      skinTypes: secondaryShotDb.skinTypes || [],
      productIds: [],
      active: secondaryShotDb.active,
    } : undefined;

    // Build Cocktail object
    const recommendedCocktailObj: Cocktail = {
      id: recommendedCocktail.id,
      slug: recommendedCocktail.slug,
      name: recommendedCocktail.name,
      menuTitle: recommendedCocktail.shortDescription || recommendedCocktail.name,
      subtitle: recommendedCocktail.shortDescription ?? undefined,
      icon: recommendedCocktail.icon ?? undefined,
      image: recommendedCocktail.image ?? undefined,
      description: recommendedCocktail.description ?? undefined,
      shortDescription: recommendedCocktail.shortDescription ?? undefined,
      mood: skinMood,
      concerns: recommendedCocktail.concerns || [],
      skinTypes: recommendedCocktail.skinTypes || [],
      active: recommendedCocktail.active,
    };

    // 6. Score breakdown percentage
    const totalWeight = shotEntries.reduce((sum, [, val]) => sum + (val ?? 0), 0) || 1;
    const scoreBreakdown: Record<string, number> = {};
    for (const [id, val] of shotEntries) {
      scoreBreakdown[id] = Math.round(((val ?? 0) / totalWeight) * 100);
    }
    const matchScore = Math.min(99, Math.max(88, Math.round(85 + (topShotScore / (totalWeight || 1)) * 14)));

    // 7. Build AM / PM Routine
    // Get shot products
    const shotProductLinks = await db.query.shotProducts.findMany({
      where: (sp, { eq }) => eq(sp.shotId, primaryShot.id),
      with: { product: { with: { images: true } } },
      orderBy: (sp, { asc }) => [asc(sp.order)],
    });
    const shotProducts = shotProductLinks.map(sp => sanitizeProduct(sp.product));

    // Get cocktail products
    const cocktailProductLinks = await db.query.cocktailProducts.findMany({
      where: (cp, { eq }) => eq(cp.cocktailId, recommendedCocktail.id),
      with: { product: { with: { images: true } } },
      orderBy: (cp, { asc }) => [asc(cp.order)],
    });
    const cocktailProducts = cocktailProductLinks.map(cp => sanitizeProduct(cp.product));

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
      recommendedCocktail: recommendedCocktailObj,
      skinMood,
      matchScore,
      scoreBreakdown,
      amRoutine,
      pmRoutine,
      personalizedMessage,
    };
  }
}
