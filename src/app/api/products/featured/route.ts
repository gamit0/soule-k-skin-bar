import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const prods = await db.query.products.findMany({
      limit: 8,
      where: (p, { eq }) => eq(p.active, true),
    });
    const imgs = await db.query.productImages.findMany();

    const data = prods.map(p => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: p.price,
      routineStep: p.routineStep,
      stock: p.stock,
      ingredients: p.ingredients || [],
      image: imgs.find(i => i.productId === p.id)?.url || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600",
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
