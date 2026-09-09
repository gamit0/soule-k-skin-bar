import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { analyticsEvents } from "@/lib/db/schema";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await db.insert(analyticsEvents).values({
      type: body.type,
      sessionId: body.sessionId,
      metadata: body.metadata ?? {},
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Analytics nunca debe romper la experiencia del usuario.
    console.error("[analytics/track]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
