import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { products, productImages } from "@/lib/db/schema";
import { eq, or, like, ilike, and, inArray, desc } from "drizzle-orm";
import { mockProducts } from "@/mock-data/products";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";

type SearchBody = {
  query?: string;
  brand?: string;
  category?: string;
  concern?: string;
  skinType?: string;
  shotId?: string;
  limit?: number;
  offset?: number;
};

export async function POST(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const body: SearchBody = await request.json();
    const {
      query,
      brand,
      category,
      concern,
      skinType,
      shotId,
      limit = 20,
      offset = 0,
    } = body;

    // Try database first
    let dbProducts: any[] = [];
    let useMock = false;

    try {
      const conditions = [eq(products.active, true)];

      if (query) {
        conditions.push(
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.description, `%${query}%`),
            ilike(products.shortDescription, `%${query}%`),
            ilike(products.brand, `%${query}%`)
          )!
        );
      }

      if (brand) {
        conditions.push(eq(products.brand, brand));
      }

      if (category) {
        conditions.push(eq(products.categoryId, category));
      }

      if (concern) {
        conditions.push(
          // products.concerns is an array, use like for simplicity
          like(products.concerns, `%${concern}%`)
        );
      }

      if (skinType) {
        conditions.push(
          like(products.skinTypes, `%${skinType}%`)
        );
      }

      if (shotId) {
        // Would need to join with shotProducts table
        // For now, we'll handle this in the mock fallback
      }

      dbProducts = await db.query.products.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: desc(products.createdAt),
        with: { images: true },
      });

      if (dbProducts.length === 0) {
        useMock = true;
      }
    } catch (dbErr) {
      console.warn("[n8n/products/search] Database error, falling back to mock:", dbErr);
      useMock = true;
    }

    if (useMock) {
      let filtered = mockProducts.filter(p => p.active);

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.concerns.some(c => c.toLowerCase().includes(q)) ||
          p.ingredients.some(i => i.toLowerCase().includes(q)) ||
          p.benefits.some(b => b.toLowerCase().includes(q))
        );
      }

      if (brand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      }

      if (category) {
        filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
      }

      if (concern) {
        filtered = filtered.filter(p =>
          p.concerns.some(c => c.toLowerCase().includes(concern.toLowerCase()))
        );
      }

      if (skinType) {
        filtered = filtered.filter(p =>
          p.skinTypes.some(st => st.toLowerCase() === skinType.toLowerCase())
        );
      }

      if (shotId) {
        // Filter by shot - would need shot-product mapping
        // For mock, we can check if product is in any shot's productIds
        const { mockShots } = await import("@/mock-data/shots");
        const shot = mockShots.find(s => s.id === shotId || s.slug === shotId);
        if (shot) {
          const shotProductIds = new Set(shot.productIds);
          filtered = filtered.filter(p => shotProductIds.has(p.id));
        }
      }

      dbProducts = filtered.slice(offset, offset + limit).map(p => ({
        ...p,
        images: p.image ? [{ url: p.image, order: 0 }] : [],
      }));
    }

    // Format response
    const formattedProducts = dbProducts.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      description: p.description,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      category: p.category,
      categoryId: p.categoryId,
      skinTypes: p.skinTypes || [],
      concerns: p.concerns || [],
      ingredients: p.ingredients || [],
      benefits: p.benefits || [],
      routineStep: p.routineStep,
      usage: p.usage,
      stock: p.stock ?? 10,
      inStock: (p.stock ?? 10) > 0,
      active: p.active,
      image: p.images?.[0]?.url,
      isMock: p.isMock,
    }));

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
      limit,
      offset,
    });
  } catch (err) {
    console.error("[n8n/products/search] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}