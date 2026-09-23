import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { addresses, customers } from "@/lib/db/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const customerId = session.user.id as string;

    const address = await db.query.addresses.findFirst({
      where: (a, { eq, and }) => and(eq(a.id, id), eq(a.customerId, customerId)),
    });

    if (!address) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (err) {
    console.error("[GET /api/addresses/:id]", err);
    return NextResponse.json({ error: "Error al obtener dirección" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const customerId = session.user.id as string;
    const body = await request.json();

    // Validate required fields
    const required = ["name", "recipientName", "phone", "street", "exteriorNumber", "city", "state", "postalCode"];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 });
      }
    }

    // Validate postal code format
    if (!/^\d{5}$/.test(body.postalCode)) {
      return NextResponse.json({ error: "Código postal debe ser 5 dígitos" }, { status: 400 });
    }

    // Check ownership
    const existing = await db.query.addresses.findFirst({
      where: (a, { eq, and }) => and(eq(a.id, id), eq(a.customerId, customerId)),
    });

    if (!existing) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (body.isDefault && !existing.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.customerId, customerId));
    }

    const [address] = await db
      .update(addresses)
      .set({
        name: body.name.trim(),
        recipientName: body.recipientName.trim(),
        phone: body.phone.trim(),
        street: body.street.trim(),
        exteriorNumber: body.exteriorNumber.trim(),
        interiorNumber: body.interiorNumber?.trim() || null,
        neighborhood: body.neighborhood?.trim() || null,
        city: body.city.trim(),
        state: body.state.trim(),
        postalCode: body.postalCode.trim(),
        isDefault: body.isDefault || false,
        updatedAt: new Date(),
      })
      .where(eq(addresses.id, id))
      .returning();

    return NextResponse.json({ address });
  } catch (err) {
    console.error("[PUT /api/addresses/:id]", err);
    return NextResponse.json({ error: "Error al actualizar dirección" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const customerId = session.user.id as string;

    // Check ownership
    const existing = await db.query.addresses.findFirst({
      where: (a, { eq, and }) => and(eq(a.id, id), eq(a.customerId, customerId)),
    });

    if (!existing) {
      return NextResponse.json({ error: "Dirección no encontrada" }, { status: 404 });
    }

    await db.delete(addresses).where(eq(addresses.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/addresses/:id]", err);
    return NextResponse.json({ error: "Error al eliminar dirección" }, { status: 500 });
  }
}