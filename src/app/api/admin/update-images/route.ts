import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { productImages, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { updates } = await req.json();

    for (const update of updates) {
      const product = await db.query.products.findFirst({
        where: eq(products.slug, update.slug),
      });

      if (product) {
        // Delete existing images for this product to avoid duplicates
        await db.delete(productImages).where(eq(productImages.productId, product.id));

        // Add new image
        await db.insert(productImages).values({
          productId: product.id,
          url: update.url,
          order: 0,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
