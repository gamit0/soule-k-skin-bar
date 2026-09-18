import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { cocktails } from "@/lib/db/schema";
import { mockCocktails } from "@/mock-data/cocktails";
import { Cocktail, Product } from "@/types";

export interface CocktailWithRoutine extends Cocktail {
  routineAM: Product[];
  routinePM: Product[];
}

export async function getActiveCocktails(): Promise<Cocktail[]> {
  try {
    const dbCocktails = await db.query.cocktails.findMany({
      where: eq(cocktails.active, true),
    });
    if (dbCocktails && dbCocktails.length > 0) {
      return dbCocktails as unknown as Cocktail[];
    }
  } catch (err) {
    console.warn("[cocktail-repository] DB fetch failed, falling back to mockCocktails:", err);
  }
  return mockCocktails.filter((c) => c.active);
}

export async function getCocktailBySlug(slug: string): Promise<CocktailWithRoutine | null> {
  try {
    const cocktail = await db.query.cocktails.findFirst({
      where: and(eq(cocktails.slug, slug), eq(cocktails.active, true)),
      with: {
        productLinks: {
          with: { product: true },
        },
      },
    });

    if (cocktail) {
      const routineAM = cocktail.productLinks
        .filter((l) => l.routine === "AM" || l.routine === "BOTH")
        .sort((a, b) => a.order - b.order)
        .map((l) => l.product as unknown as Product);

      const routinePM = cocktail.productLinks
        .filter((l) => l.routine === "PM" || l.routine === "BOTH")
        .sort((a, b) => a.order - b.order)
        .map((l) => l.product as unknown as Product);

      return { ...(cocktail as unknown as Cocktail), routineAM, routinePM };
    }
  } catch (err) {
    console.warn("[cocktail-repository] DB fetch failed, falling back to mockCocktails:", err);
  }

  // Fallback to mockCocktails
  const fallback = mockCocktails.find((c) => c.slug === slug && c.active);
  if (!fallback) return null;

  const prods = fallback.products ?? [];
  const routineAM = prods.filter((p) => p.usage === "AM" || p.usage === "BOTH");
  const routinePM = prods.filter((p) => p.usage === "PM" || p.usage === "BOTH");

  return { ...fallback, routineAM, routinePM };
}
