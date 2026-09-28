import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { orders, orderItems, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: {
              with: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        customerId: order.customerId,
        guestEmail: order.guestEmail,
        guestPhone: order.guestPhone,
        status: order.status,
        subtotal: Number(order.subtotal),
        total: Number(order.total),
        paymentStatus: order.paymentStatus,
        paymentProviderRef: order.paymentProviderRef,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            brand: item.product.brand,
            price: Number(item.product.price),
            image: item.product.images?.[0]?.url,
          } : null,
          shotId: null,
          cocktailId: item.cocktailId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
      },
    });
  } catch (err) {
    console.error("[n8n/orders/[id]] Error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}