import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { addresses } from "@/lib/db/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Props) {
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

    // Unset other defaults
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.customerId, customerId));

    // Set this as default
    const [address] = await db
      .update(addresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(addresses.id, id))
      .returning();

    return NextResponse.json({ address });
  } catch (err) {
    console.error("[POST /api/addresses/:id/default]", err);
    return NextResponse.json({ error: "Error al establecer dirección predeterminada" }, { status: 500 });
  }
}