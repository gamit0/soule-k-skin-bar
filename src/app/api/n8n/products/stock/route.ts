import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { inArray, eq } from "drizzle-orm";
import { mockProducts } from "@/mock-data/products";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";

type StockBody = {
  productIds: string[];
};

export async function POST(request: Request) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const body: StockBody = await request.json();

    if (!body.productIds || !Array.isArray(body.productIds)) {
      return NextResponse.json(
        { error: "Product IDs are required." },
        { status: 400 }
      );
    }

    // Try database first
    let dbProducts: any[] = [];
    let useMock = false;

    try {
      dbProducts = await db.query.products.findMany({
        where: inArray(products.id, body.productIds),
      });

      if (dbProducts.length === 0) {
        useMock = true;
      }
    } catch (dbErr) {
      console.warn("[n8n/products/stock] Database unreachable, falling back to mock:", dbErr);
      useMock = true;
    }

    const stockStatus = body.productIds.map((id) => {
      let match: any = null;
      if (!useMock && dbProducts.length > 0) {
        match = dbProducts.find(p => p.id === id || p.slug === id);
      }
      if (!match) {
        match = mockProducts.find(p => p.id === id || p.slug === id);
      }
      const stock = match?.stock ?? 10;
      return {
        id,
        stock,
        inStock: stock > 0,
      };
    });

    return NextResponse.json({ stockStatus });
  } catch (err) {
    console.error("[n8n/products/stock] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}