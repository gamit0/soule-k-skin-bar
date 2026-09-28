import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { products, productImages } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { mockProducts } from "@/mock-data/products";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const { id } = await params;

    // Try database first
    let product: any = null;
    let useMock = false;

    try {
      product = await db.query.products.findFirst({
        where: or(eq(products.id, id), eq(products.slug, id)),
        with: { images: true },
      });

      if (!product) {
        useMock = true;
      }
    } catch (dbErr) {
      console.warn("[n8n/products/[id]] Database error, falling back to mock:", dbErr);
      useMock = true;
    }

    if (useMock) {
      product = mockProducts.find(p => p.id === id || p.slug === id);
    }

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const formattedProduct = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      category: product.category,
      categoryId: product.categoryId,
      skinTypes: product.skinTypes || [],
      concerns: product.concerns || [],
      ingredients: product.ingredients || [],
      benefits: product.benefits || [],
      routineStep: product.routineStep,
      usage: product.usage,
      stock: product.stock ?? 10,
      inStock: (product.stock ?? 10) > 0,
      active: product.active,
      image: product.images?.[0]?.url,
      isMock: product.isMock,
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (err) {
    console.error("[n8n/products/[id]] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}