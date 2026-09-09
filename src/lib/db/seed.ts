// Script de seed — carga los datos mock definidos en /src/mock-data en la
// base de datos, para poder probar el flujo completo (quiz → scoring →
// cocktail → checkout) antes de tener datos reales. Correr con:
//   npx tsx src/lib/db/seed.ts

import { db } from "./client";
import { products, cocktails, cocktailProducts, quizQuestions, quizOptions, quizOptionWeights } from "./schema";
import { mockFeaturedProducts } from "@/mock-data/products";
import { mockCocktails } from "@/mock-data/cocktails";

async function seed() {
  console.log("Seeding productos...");
  const insertedProducts = await db
    .insert(products)
    .values(
      mockFeaturedProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        price: p.price.toString(),
        routineStep: p.routineStep,
        isMock: true,
        stock: 100,
      })),
    )
    .returning();

  console.log("Seeding cocktails...");
  const insertedCocktails = await db
    .insert(cocktails)
    .values(
      mockCocktails.map((c) => ({
        slug: c.slug,
        name: c.name,
        shortDescription: c.shortDescription,
        description: c.shortDescription,
        concerns: c.concerns as (typeof cocktails.$inferInsert)["concerns"],
      })),
    )
    .returning();

  // Asocia cada cocktail con los 4 productos mock en una rutina AM/PM
  // básica, solo para tener algo navegable de punta a punta.
  console.log("Asociando productos a cocktails...");
  for (const cocktail of insertedCocktails) {
    await db.insert(cocktailProducts).values(
      insertedProducts.map((p, i) => ({
        cocktailId: cocktail.id,
        productId: p.id,
        routine: "BOTH" as const,
        order: i,
      })),
    );
  }

  console.log("Seeding pregunta de ejemplo del quiz...");
  const [question] = await db
    .insert(quizQuestions)
    .values({ text: "¿Cuál es tu principal preocupación?", type: "single", order: 1 })
    .returning();

  const options = await db
    .insert(quizOptions)
    .values(
      insertedCocktails.slice(0, 4).map((c) => ({
        questionId: question!.id,
        label: c.name,
        value: c.slug,
      })),
    )
    .returning();

  for (let i = 0; i < options.length; i++) {
    await db.insert(quizOptionWeights).values({
      optionId: options[i]!.id,
      cocktailId: insertedCocktails[i]!.id,
      weight: 10,
    });
  }

  console.log("Seed completo ✅");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
