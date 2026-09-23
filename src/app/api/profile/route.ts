import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { customers } from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const customerId = session.user.id as string;

    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, customerId),
    });

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        skinType: customer.skinType,
        concerns: customer.concerns,
      },
    });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const customerId = session.user.id as string;
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (body.phone && !/^[\d\s\-+()]{10,}$/.test(body.phone)) {
      return NextResponse.json({ error: "Teléfono inválido" }, { status: 400 });
    }

    // Check if email is already taken by another customer
    const existingEmail = await db.query.customers.findFirst({
      where: (c, { eq, and, ne }) => and(eq(c.email, body.email), ne(c.id, customerId)),
    });

    if (existingEmail) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 400 });
    }

    const [customer] = await db
      .update(customers)
      .set({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        skinType: body.skinType || null,
        concerns: body.concerns || [],
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId))
      .returning();

    return NextResponse.json({ customer });
  } catch (err) {
    console.error("[PUT /api/profile]", err);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}