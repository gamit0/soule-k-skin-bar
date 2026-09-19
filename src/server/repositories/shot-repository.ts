import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { shots, shotProducts, products, productImages } from "@/lib/db/schema";
import { Shot, Product } from "@/types";

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

export async function getActiveShots(): Promise<Shot[]> {
  const result = await db.query.shots.findMany({
    where: (s, { eq }) => eq(s.active, true),
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

  return result.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    menuTitle: s.menuTitle || s.name,
    icon: s.icon || "✨",
    subtitle: s.subtitle || "",
    description: s.description || "",
    category: s.category || "Personalized",
    mood: s.mood || "Glow",
    active: s.active,
    skinTypes: s.skinTypes,
    concerns: s.concerns,
    productIds: s.productLinks.map(pl => pl.product.id),
    totalPrice: s.productLinks.reduce((sum, pl) => sum + Number(pl.product.price), 0),
    products: s.productLinks.map((pl) => {
      const product = sanitizeProduct(pl.product);
      return {
        ...product,
        shortDescription: pl.product.description?.substring(0, 100) + "...",
      };
    }),
  })) as Shot[];
}

export async function getShotBySlug(slug: string): Promise<Shot | null> {
  const result = await db.query.shots.findFirst({
    where: (s, { eq }) => eq(s.slug, slug),
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
    menuTitle: result.menuTitle || result.name,
    icon: result.icon || "✨",
    subtitle: result.subtitle || "",
    description: result.description || "",
    category: result.category || "Personalized",
    mood: result.mood || "Glow",
    active: result.active,
    skinTypes: result.skinTypes,
    concerns: result.concerns,
    productIds: result.productLinks.map(pl => pl.product.id),
    totalPrice: result.productLinks.reduce((sum, pl) => sum + Number(pl.product.price), 0),
    products: result.productLinks.map((pl) => {
      const product = sanitizeProduct(pl.product);
      return {
        ...product,
        shortDescription: pl.product.description?.substring(0, 100) + "...",
      };
    }),
  } as Shot;
}
