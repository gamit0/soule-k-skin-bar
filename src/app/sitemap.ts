import type { MetadataRoute } from "next";
import { db } from "@/lib/db/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://soulekskinbar.com";

  const [products, cocktails] = await Promise.all([
    db.query.products.findMany({ where: (p, { eq }) => eq(p.active, true) }),
    db.query.cocktails.findMany({ where: (c, { eq }) => eq(c.active, true) }),
  ]);

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/quiz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/products`, changeFrequency: "weekly", priority: 0.8 },
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cocktails.map((c) => ({
      url: `${baseUrl}/cocktails/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
