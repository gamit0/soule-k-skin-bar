import Link from "next/link";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Partial<Product> & { image?: string } }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-blush/30 transition-colors group-hover:bg-blush/50">
        <img
          src={product.image || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-wide text-plum-ink/50">
        {product.brand}
      </p>
      <h3 className="mt-1 text-plum-ink">{product.name}</h3>
      <p className="mt-1 text-sm text-plum-ink/70">${product.price} MXN</p>
    </Link>
  );
}
