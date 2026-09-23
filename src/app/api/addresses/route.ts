import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { addresses, customers } from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const customerId = session.user.id as string;

    const userAddresses = await db.query.addresses.findMany({
      where: eq(addresses.customerId, customerId),
      orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.createdAt)],
    });

    return NextResponse.json({ addresses: userAddresses });
  } catch (err) {
    console.error("[GET /api/addresses]", err);
    return NextResponse.json({ error: "Error al obtener direcciones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.customerId, customerId));
    }

    const [address] = await db
      .insert(addresses)
      .values({
        customerId,
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
        country: "MX",
        isDefault: body.isDefault || false,
      })
      .returning();

    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/addresses]", err);
    return NextResponse.json({ error: "Error al crear dirección" }, { status: 500 });
  }
}