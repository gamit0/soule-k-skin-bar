"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";

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
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  // Deduplica por si un producto aparece en AM y PM (usage: BOTH).
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.id, p])).values(),
  );

  // Verificación de stock: todos los productos deben tener stock > 0
  const allInStock = uniqueProducts.every((p) => (p.stock ?? 1) > 0);
  const outOfStockProduct = uniqueProducts.find((p) => (p.stock ?? 1) <= 0);

  async function handleAddToCart() {
    if (!allInStock) return;

    setIsAdding(true);
    try {
      addItems(
        uniqueProducts.map((p) => ({
          productId: p.id,
          name: p.name,
          price: Number(p.price),
          cocktailId,
        })),
      );
      router.push("/cart");
    } catch (error) {
      console.error("Error adding cocktail to cart:", error);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!allInStock || isAdding}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 transition-all duration-300 ${
        allInStock
          ? "bg-wine text-ivory hover:bg-wine-dark hover:shadow-lg active:scale-95 cursor-pointer"
          : "bg-plum-ink/10 text-plum-ink/40 cursor-not-allowed"
      }`}
    >
      {isAdding ? (
        "Añadiendo..."
      ) : allInStock ? (
        `🛒 Comprar mi ${cocktailName} Cocktail`
      ) : (
        `⚠️ ${outOfStockProduct?.name || "Agotado"}`
      )}
    </button>
  );
}
