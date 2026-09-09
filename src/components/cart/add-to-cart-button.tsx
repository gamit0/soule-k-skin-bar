"use client";

import { useCart } from "@/lib/cart-context";
import { track } from "@/lib/track";

export function AddToCartButton({
  productId,
  name,
  price,
}: {
  productId: string;
  name: string;
  price: number;
}) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ productId, name, price });
        track("add_to_cart", { productId, name });
      }}
      className="rounded-full bg-wine px-6 py-3 text-ivory transition-colors hover:bg-wine-dark"
    >
      Agregar al carrito
    </button>
  );
}
