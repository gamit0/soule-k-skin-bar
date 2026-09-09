import type { InferSelectModel } from "drizzle-orm";
import type { products as productsTable } from "@/lib/db/schema";

type Product = InferSelectModel<typeof productsTable>;

// JSON-LD schema.org/Product — mejora resultados enriquecidos en Google.
export function productJsonLd(product: Product, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.shortDescription ?? undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MXN",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },
  };
}
