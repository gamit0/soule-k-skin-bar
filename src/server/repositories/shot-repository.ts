import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { cocktails, cocktailProducts, products, productImages } from "@/lib/db/schema";
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
    menuTitle: c.name,
    icon: c.icon || "✨",
    subtitle: c.shortDescription || "",
    description: c.description || "",
    category: "Personalized",
    mood: "Glow",
    active: c.active,
    skinTypes: c.skinTypes,
    concerns: c.concerns,
    productIds: c.productLinks.map(pl => pl.product.id),
    totalPrice: c.productLinks.reduce((sum, pl) => sum + Number(pl.product.price), 0),
    products: c.productLinks.map((pl) => {
      const product = sanitizeProduct(pl.product);
      return {
        ...product,
        shortDescription: pl.product.description?.substring(0, 100) + "...",
      };
    }),
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
    menuTitle: result.name,
    icon: result.icon || "✨",
    subtitle: result.shortDescription || "",
    description: result.description || "",
    category: "Personalized",
    mood: "Glow",
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
