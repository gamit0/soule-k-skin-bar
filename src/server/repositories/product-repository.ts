import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products, productImages } from "@/lib/db/schema";

export async function getActiveProducts() {
  return db.query.products.findMany({
    where: eq(products.active, true),
    with: { images: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.active, true)),
    with: { images: true },
  });
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return db.query.products.findMany({
    where: (p, { inArray }) => inArray(p.id, ids),
  });
}
