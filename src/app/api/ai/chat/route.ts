import { NextResponse } from "next/server";
import { generateSoulAiReply } from "@/server/services/soule-ai";

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  try {
    const reply = await generateSoulAiReply(message);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ai/chat]", err);
    return NextResponse.json(
      {
        error:
          "Soule AI no está disponible en este momento. ¿Quieres hablar con una especialista por WhatsApp?",
      },
      { status: 503 },
    );
  }
}
