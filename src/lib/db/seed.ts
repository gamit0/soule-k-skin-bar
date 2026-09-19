// Script de seed — carga los datos mock definidos en /src/mock-data en la
// base de datos, para poder probar el flujo completo (quiz → scoring →
// cocktail → checkout) antes de tener datos reales. Correr con:
//   npx tsx src/lib/db/seed.ts

import "dotenv/config";
import { db } from "./client";
import { sql } from "drizzle-orm";
import { products, cocktails, cocktailProducts, quizQuestions, quizOptions, quizOptionWeights, productImages, shots, shotProducts, concernEnum, skinTypeEnum } from "./schema";
import { mockProducts } from "@/mock-data/products";
import { mockCocktails } from "@/mock-data/cocktails";
import { mockShots } from "@/mock-data/shots";
import { fallbackQuizQuestions } from "@/mock-data/quiz-fallback";
import type { SkinType } from "@/lib/db/schema";

const VALID_CONCERNS = concernEnum.enumValues;
const VALID_SKIN_TYPES = skinTypeEnum.enumValues;

// URLs curadas con estética K-Beauty (Seoul Korea Skincare): minimalista, limpio, fondos claros.
const K_BEAUTY_IMAGES = [
  "https://images.unsplash.com/photo-1598440947619-27a8b4447ed3?auto=format&fit=crop&q=80&w=800", // Clean skin
  "https://images.unsplash.com/photo-1612817288484-6f9C77376778?auto=format&fit=crop&q=80&w=800", // Glass bottles
  "https://images.unsplash.com/photo-1570172619644-797ed64c374a?auto=format&fit=crop&q=80&w=800", // Arrangement
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800", // White bottle
  "https://images.unsplash.com/photo-1596755094514-f87e302776c7?auto=format&fit=crop&q=80&w=800", // Soft colors
  "https://images.unsplash.com/photo-1601049541289-9b1b7677636a?auto=format&fit=crop&q=80&w=800", // Organic
  "https://images.unsplash.com/photo-1556228578-07257739599a?auto=format&fit=crop&q=80&w=800", // Serums
  "https://images.unsplash.com/photo-1608248597279-f99d167c97f7?auto=format&fit=crop&q=80&w=800", // Beauty
  "https://images.unsplash.com/photo-1611080626916-07774bc6c3f2?auto=format&fit=crop&q=80&w=800", // Pastel
  "https://images.unsplash.com/photo-1598440947619-27a8b4447ed3?auto=format&fit=crop&q=80&w=800", // Cream
  "https://images.unsplash.com/photo-1570172619644-797ed64c374a?auto=format&fit=crop&q=80&w=800", // Luxury
  "https://images.unsplash.com/photo-1612817288484-6f9C77376778?auto=format&fit=crop&q=80&w=800", // Essence
  "https://images.unsplash.com/photo-1596755094514-f87e302776c7?auto=format&fit=crop&q=80&w=800", // Bottle
  "https://images.unsplash.com/photo-1601049541289-9b1b7677636a?auto=format&fit=crop&q=80&w=800", // Glow
  "https://images.unsplash.com/photo-1556228578-07257739599a?auto=format&fit=crop&q=80&w=800", // Gel
];

async function seed() {
  console.log("Limpiando base de datos...");
  await db.execute(sql`TRUNCATE TABLE quiz_option_weights, quiz_options, quiz_questions, shot_products, shots, cocktail_products, cocktails, product_images, products CASCADE`);

  console.log("Seeding productos...");
  const insertedProducts = await db
    .insert(products)
    .values(
      mockProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price.toString(),
        compareAtPrice: p.compareAtPrice?.toString(),
        categoryId: null, // Se puede poblar si se crean categorías
        skinTypes: (p.skinTypes as string[]).filter(st => VALID_SKIN_TYPES.includes(st as any)) as unknown as SkinType[],
        concerns: (p.concerns as string[]).filter(c => VALID_CONCERNS.includes(c as any)) as unknown as (typeof concernEnum.enumValues)[number][],
        ingredients: p.ingredients,
        benefits: p.benefits,
        routineStep: (["cleanser", "serum", "moisturizer", "sunscreen", "treatment", "toner", "eye_cream", "special_care"].includes(p.routineStep) ? p.routineStep : "treatment") as any,
        usage: p.usage,
        stock: p.stock ?? 100,
        active: p.active ?? true,
        isMock: true,
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
        description: c.description,
        icon: c.icon,
        image: c.image,
        concerns: (c.concerns || []).filter(con => VALID_CONCERNS.includes(con as any)) as unknown as (typeof concernEnum.enumValues)[number][],
        skinTypes: (c.skinTypes || []).filter(st => VALID_SKIN_TYPES.includes(st as any)) as unknown as SkinType[],
        active: c.active ?? true,
      })),
    )
    .returning();

  console.log("Asociando productos a cocktails...");
  const productMap = new Map<string, string>();
  mockProducts.forEach((p, i) => {
    if (insertedProducts[i]) {
      productMap.set(p.id, insertedProducts[i].id);
    }
  });

  for (const cocktail of insertedCocktails) {
    const mockCocktail = mockCocktails.find(mc => mc.slug === cocktail.slug);
    if (!mockCocktail || !mockCocktail.steps) continue;

    const associations = mockCocktail.steps.map((step, index) => {
      const dbProductId = productMap.get(step.productId);
      if (!dbProductId) {
        console.warn(`Product ${step.productId} not found in database for cocktail ${cocktail.slug}`);
        return null;
      }
      return {
        cocktailId: cocktail.id,
        productId: dbProductId,
        routine: step.usage as "AM" | "PM" | "BOTH",
        order: index,
      };
    }).filter(Boolean);

    if (associations.length > 0) {
      await db.insert(cocktailProducts).values(associations as any);
    }
  }

  console.log("Seeding shots...");
  const insertedShots = await db
    .insert(shots)
    .values(
      mockShots.map((s) => ({
        slug: s.slug,
        name: s.name,
        menuTitle: s.menuTitle,
        subtitle: s.subtitle,
        category: s.category,
        description: s.description,
        icon: s.icon,
        mood: s.mood,
        concerns: (s.concerns as string[]).filter(c => VALID_CONCERNS.includes(c as any)) as unknown as (typeof concernEnum.enumValues)[number][],
        skinTypes: (s.skinTypes as string[]).filter(st => VALID_SKIN_TYPES.includes(st as any)) as unknown as SkinType[],
        active: s.active ?? true,
      })),
    )
    .returning();

  console.log("Asociando productos a shots...");
  const shotMap = new Map<string, string>();
  mockShots.forEach((ms, i) => {
    if (insertedShots[i]) {
      shotMap.set(ms.id, insertedShots[i].id);
    }
  });

  for (const shot of insertedShots) {
    const mockShot = mockShots.find(ms => ms.slug === shot.slug);
    if (!mockShot || !mockShot.products) continue;

    const associations = mockShot.products.map((p, index) => {
      const dbProductId = productMap.get(p.id);
      if (!dbProductId) {
        console.warn(`Product ${p.id} not found in database for shot ${shot.slug}`);
        return null;
      }
      return {
        shotId: shot.id,
        productId: dbProductId,
        order: index,
      };
    }).filter(Boolean);

    if (associations.length > 0) {
      await db.insert(shotProducts).values(associations as any);
    }
  }

  console.log("Seeding quiz questions...");
  for (const q of fallbackQuizQuestions) {
    const [question] = await db
      .insert(quizQuestions)
      .values({
        order: q.order,
        text: q.text ?? q.title,
        type: q.type,
        active: q.active,
      })
      .returning();

    if (!question) continue;

    for (const opt of q.options) {
      const [option] = await db
        .insert(quizOptions)
        .values({
          questionId: question.id,
          label: opt.label,
          value: opt.value,
        })
        .returning();

      if (!option) continue;

      // Insert shot weights
      if (opt.shotWeights) {
        for (const [shotId, weight] of Object.entries(opt.shotWeights)) {
          const dbShotId = shotMap.get(shotId);
          if (dbShotId) {
            await db.insert(quizOptionWeights).values({
              optionId: option.id,
              shotId: dbShotId,
              weight,
            });
          }
        }
      }
    }
  }

  console.log("Seed completo ✅");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });