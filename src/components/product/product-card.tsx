import Link from "next/link";
import type { products } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof products>;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="aspect-[3/4] rounded-2xl bg-blush/30 transition-colors group-hover:bg-blush/50" />
      <p className="mt-4 text-xs uppercase tracking-wide text-plum-ink/50">
        {product.brand}
      </p>
      <h3 className="mt-1 text-plum-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-plum-ink/70">${product.price} MXN</p>
    </Link>
  );
}
