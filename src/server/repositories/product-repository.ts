import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { mockProducts } from "@/mock-data/products";
import { Product } from "@/types";

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const dbProds = await db.query.products.findMany({
      where: eq(products.active, true),
      with: { images: true },
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
    if (dbProds && dbProds.length > 0) {
      return dbProds as unknown as Product[];
    }
  } catch (err) {
    console.warn("[product-repository] DB fetch failed, falling back to mockProducts:", err);
  }
  return mockProducts.filter((p) => p.active);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbProd = await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.active, true)),
      with: { images: true },
    });
    if (dbProd) {
      return dbProd as unknown as Product;
    }
  } catch (err) {
    console.warn("[product-repository] DB fetch failed, falling back to mockProducts:", err);
  }
  return mockProducts.find((p) => p.slug === slug && p.active) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  try {
    const dbProds = await db.query.products.findMany({
      where: (p, { inArray }) => inArray(p.id, ids),
    });
    if (dbProds && dbProds.length > 0) {
      return dbProds as unknown as Product[];
    }
  } catch (err) {
    console.warn("[product-repository] DB fetch failed, falling back to mockProducts:", err);
  }
  const idSet = new Set(ids);
  return mockProducts.filter((p) => idSet.has(p.id));
}
