import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { cocktails, cocktailProducts, products, productImages } from "@/lib/db/schema";
import { Shot } from "@/types";

export async function getActiveShots(): Promise<Shot[]> {
  const result = await db.query.cocktails.findMany({
    where: (c, { eq }) => eq(c.active, true),
    with: {
      productLinks: {
        with: {
          product: {
            with: {
              images: true,
            },
          },
        },
      },
    },
  });

  return result.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon || "✨",
    subtitle: c.shortDescription || "",
    description: c.description || "",
    category: "Personalized",
    mood: "Glow",
    active: c.active,
    skinTypes: c.skinTypes,
    concerns: c.concerns,
    totalPrice: c.productLinks.reduce((sum, pl) => sum + Number(pl.product.price), 0),
    products: c.productLinks.map((pl) => ({
      id: pl.product.id,
      slug: pl.product.slug,
      name: pl.product.name,
      brand: pl.product.brand,
      price: Number(pl.product.price),
      routineStep: pl.product.routineStep,
      usage: pl.routine as "AM" | "PM" | "BOTH",
      shortDescription: pl.product.description?.substring(0, 100) + "...",
      ingredients: [],
      stock: pl.product.stock,
      image: pl.product.images[0]?.url || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600",
    })),
  })) as Shot[];
}

export async function getShotBySlug(slug: string): Promise<Shot | null> {
  const result = await db.query.cocktails.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
    with: {
      productLinks: {
        with: {
          product: {
            with: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!result) return null;

  return {
    id: result.id,
    slug: result.slug,
    name: result.name,
    icon: result.icon || "✨",
    subtitle: result.shortDescription || "",
    description: result.description || "",
    category: "Personalized",
    mood: "Glow",
    active: result.active,
    skinTypes: result.skinTypes,
    concerns: result.concerns,
    totalPrice: result.productLinks.reduce((sum, pl) => sum + Number(pl.product.price), 0),
    products: result.productLinks.map((pl) => ({
      id: pl.product.id,
      slug: pl.product.slug,
      name: pl.product.name,
      brand: pl.product.brand,
      price: Number(pl.product.price),
      routineStep: pl.product.routineStep,
      usage: pl.routine as "AM" | "PM" | "BOTH",
      shortDescription: pl.product.description?.substring(0, 100) + "...",
      ingredients: [],
      stock: pl.product.stock,
      image: pl.product.images[0]?.url || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600",
    })),
  } as Shot;
}
