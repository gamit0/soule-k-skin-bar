import { NextResponse } from "next/server";
import { getShotBySlug } from "@/server/repositories/shot-repository";
import { verifyN8nAuth, createN8nUnauthorizedResponse } from "@/lib/n8n-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Verify n8n authentication
  if (!verifyN8nAuth(request)) {
    return createN8nUnauthorizedResponse();
  }

  try {
    const { slug } = await params;
    const shot = await getShotBySlug(slug);

    if (!shot) {
      return NextResponse.json(
        { error: "Shot no encontrado" },
        { status: 404 }
      );
    }

    const formattedShot = {
      id: shot.id,
      slug: shot.slug,
      name: shot.name,
      menuTitle: shot.menuTitle,
      subtitle: shot.subtitle,
      category: shot.category,
      description: shot.description,
      icon: shot.icon,
      mood: shot.mood,
      concerns: shot.concerns,
      skinTypes: shot.skinTypes,
      productIds: shot.productIds,
      totalPrice: shot.totalPrice,
      active: shot.active,
      products: shot.products?.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
        price: Number(p.price),
        category: p.category,
        routineStep: p.routineStep,
        usage: p.usage,
        skinTypes: p.skinTypes,
        concerns: p.concerns,
        ingredients: p.ingredients,
        benefits: p.benefits,
        stock: p.stock,
        inStock: (p.stock ?? 1) > 0,
        active: p.active,
        image: p.image,
      })),
    };

    return NextResponse.json({ shot: formattedShot });
  } catch (err) {
    console.error("[n8n/shots/[slug]] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}