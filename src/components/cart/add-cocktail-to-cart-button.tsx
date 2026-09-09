"use client";

import { useCart } from "@/lib/cart-context";
import type { products } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof products>;

export function AddCocktailToCartButton({
  cocktailId,
  cocktailName,
  products,
}: {
  cocktailId: string;
  cocktailName: string;
  products: Product[];
}) {
  const { addItems } = useCart();

  // Deduplica por si un producto aparece en AM y PM (usage: BOTH).
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.id, p])).values(),
  );

  return (
    <button
      type="button"
      onClick={() =>
        addItems(
          uniqueProducts.map((p) => ({
            productId: p.id,
            name: p.name,
            price: Number(p.price),
            cocktailId,
          })),
        )
      }
      className="inline-flex items-center justify-center rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark"
    >
      🛒 Comprar mi {cocktailName} Cocktail
    </button>
  );
}
