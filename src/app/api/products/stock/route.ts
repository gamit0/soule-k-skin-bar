import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { mockProducts } from "@/mock-data/products";

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ error: "Product IDs are required." }, { status: 400 });
    }

    try {
      const items = await db.query.products.findMany({
        where: (products, { inArray }) => inArray(products.id, productIds),
      });

      if (items.length > 0) {
        const stockStatus = items.map((p) => ({
          id: p.id,
          stock: p.stock ?? 10,
          inStock: (p.stock ?? 10) > 0,
        }));
        return NextResponse.json({ stockStatus });
      }
    } catch (dbErr) {
      console.warn("[api/products/stock] Database unreachable, falling back to mock dataset:", dbErr);
    }

    // Fallback to mock products
    const stockStatus = productIds.map((id) => {
      const match = mockProducts.find((p) => p.id === id || p.slug === id);
      const stock = match?.stock ?? 15;
      return {
        id,
        stock,
        inStock: stock > 0,
      };
    });

    return NextResponse.json({ stockStatus });
  } catch (err) {
    console.error("[api/products/stock] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
