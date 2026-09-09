import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { cocktails } from "@/lib/db/schema";

export async function getActiveCocktails() {
  return db.query.cocktails.findMany({
    where: eq(cocktails.active, true),
  });
}

export async function getCocktailBySlug(slug: string) {
  const cocktail = await db.query.cocktails.findFirst({
    where: and(eq(cocktails.slug, slug), eq(cocktails.active, true)),
    with: {
      productLinks: {
        with: { product: true },
      },
    },
  });

  if (!cocktail) return null;

  const routineAM = cocktail.productLinks
    .filter((l) => l.routine === "AM" || l.routine === "BOTH")
    .sort((a, b) => a.order - b.order)
    .map((l) => l.product);

  const routinePM = cocktail.productLinks
    .filter((l) => l.routine === "PM" || l.routine === "BOTH")
    .sort((a, b) => a.order - b.order)
    .map((l) => l.product);

  return { ...cocktail, routineAM, routinePM };
}
