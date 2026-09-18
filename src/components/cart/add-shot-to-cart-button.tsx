"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Product, Shot } from "@/types";

export function AddShotToCartButton({
  shot,
}: {
  shot: Shot;
}) {
  const { addItems } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const products = shot.products ?? [];
  const uniqueProducts = Array.from(new Map(products.map((p) => [p.id, p])).values());
  const allInStock = uniqueProducts.length > 0 && uniqueProducts.every((p) => (p.stock ?? 1) > 0);

  async function handleAddToCart() {
    if (!allInStock) return;

    setIsAdding(true);
    try {
      addItems(
        uniqueProducts.map((p) => ({
          productId: p.id,
          name: p.name,
          price: Number(p.price),
        }))
      );
      router.push("/cart");
    } catch (error) {
      console.error("Error adding shot to cart:", error);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!allInStock || isAdding}
      className={`w-full inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 ${
        allInStock
          ? "bg-wine text-ivory hover:bg-wine-dark hover:shadow-lg active:scale-95 cursor-pointer"
          : "bg-plum-ink/10 text-plum-ink/40 cursor-not-allowed"
      }`}
    >
      {isAdding ? (
        "Añadiendo al carrito..."
      ) : allInStock ? (
        `✨ Añadir Shot Completo al Carrito ($${shot.totalPrice?.toFixed(2)} MXN)`
      ) : (
        "⚠️ Producto temporalmente agotado"
      )}
    </button>
  );
}
