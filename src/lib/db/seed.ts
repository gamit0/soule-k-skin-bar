// Script de seed — carga los datos mock definidos en /src/mock-data en la
// base de datos, para poder probar el flujo completo (quiz → scoring →
// cocktail → checkout) antes de tener datos reales. Correr con:
//   npx tsx src/lib/db/seed.ts

import "dotenv/config";
import { db } from "./client";
import { sql } from "drizzle-orm";
import { products, cocktails, cocktailProducts, quizQuestions, quizOptions, quizOptionWeights, productImages } from "./schema";
import { mockFeaturedProducts } from "@/mock-data/products";
import { mockCocktails } from "@/mock-data/cocktails";

// URLs curadas con estética K-Beauty (Seoul Korea Skincare): minimalista, limpio, fondos claros.
const K_BEAUTY_IMAGES = [
  "https://images.unsplash.com/photo-1556228578-07257739599a?auto=format&fit=crop&q=80&w=800", // Serums/Drops
  "https://images.unsplash.com/photo-1598440947619-27a8b4447ed3?auto=format&fit=crop&q=80&w=800", // Creams/Jars
  "https://images.unsplash.com/photo-1612817288484-6f9C77376778?auto=format&fit=crop&q=80&w=800", // Glass bottles
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800", // Minimalist white bottle
  "https://images.unsplash.com/photo-1570172619644-797ed64c374a?auto=format&fit=crop&q=80&w=800", // Skincare arrangement
  "https://images.unsplash.com/photo-1596755094514-f87e302776c7?auto=format&fit=crop&q=80&w=800", // Soft colors
  "https://images.unsplash.com/photo-1601049541289-9b1b7677636a?auto=format&fit=crop&q=80&w=800", // Organic feel
  "https://images.unsplash.com/photo-1556228578-07257739599a?auto=format&fit=crop&q=80&w=800", // Clear gel
  "https://images.unsplash.com/photo-1608248597279-f99d167c97f7?auto=format&fit=crop&q=80&w=800", // Beauty products
  "https://images.unsplash.com/photo-1598440947619-27a8b4447ed3?auto=format&fit=crop&q=80&w=800", // White cream
  "https://images.unsplash.com/photo-1611080626916-07774bc6c3f2?auto=format&fit=crop&q=80&w=800", // Pastel tones
  "https://images.unsplash.com/photo-1570172619644-797ed64c374a?auto=format&fit=crop&q=80&w=800", // Luxury minimal
  "https://images.unsplash.com/photo-1612817288484-6f9C77376778?auto=format&fit=crop&q=80&w=800", // Essence
  "https://images.unsplash.com/photo-1596755094514-f87e302776c7?auto=format&fit=crop&q=80&w=800", // Aesthetic bottle
  "https://images.unsplash.com/photo-1601049541289-9b1b7677636a?auto=format&fit=crop&q=80&w=800", // Skin glow
];

async function seed() {
  console.log("Limpiando base de datos...");
  await db.execute(sql`TRUNCATE TABLE quiz_option_weights, quiz_options, quiz_questions, cocktail_products, cocktails, product_images, products CASCADE`);

  console.log("Seeding productos...");
  const insertedProducts = await db
    .insert(products)
    .values(
      mockFeaturedProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        price: p.price.toString(),
        routineStep: p.routineStep as "cleanser" | "serum" | "moisturizer" | "sunscreen" | "treatment",
        isMock: true,
        stock: 100,
      })),
    )
    .returning();

  console.log("Seeding imágenes K-Beauty...");
  await db.insert(productImages).values(
    insertedProducts.map((p, i) => ({
      productId: p.id,
      url: K_BEAUTY_IMAGES[i % K_BEAUTY_IMAGES.length] as string,
      order: 0,
    }))
  );

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

  console.log("Asociando productos a cocktails...");
  for (const cocktail of insertedCocktails) {
    const routineAM = insertedProducts.filter(p => {
      const p0 = insertedProducts[0];
      const p3 = insertedProducts[3];
      const p9 = insertedProducts[9];
      return (p0 && p.id === p0.id) || (p3 && p.id === p3.id) || (p9 && p.id === p9.id);
    });

    const routinePM = insertedProducts.filter(p => {
      const p0 = insertedProducts[0];
      const p5 = insertedProducts[5];
      const p7 = insertedProducts[7];
      return (p0 && p.id === p0.id) || (p5 && p.id === p5.id) || (p7 && p.id === p7.id);
    });

    await db.insert(cocktailProducts).values(
      routineAM.map((p, i) => ({
        cocktailId: cocktail.id,
        productId: p.id,
        routine: "AM" as const,
        order: i,
      }))
    );

    await db.insert(cocktailProducts).values(
      routinePM.map((p, i) => ({
        cocktailId: cocktail.id,
        productId: p.id,
        routine: "PM" as const,
        order: i,
      }))
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
