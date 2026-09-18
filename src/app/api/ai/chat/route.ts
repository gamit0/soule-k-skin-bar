import { NextResponse } from "next/server";
import { generateSoulAiReply } from "@/server/services/soule-ai";

export async function POST(request: Request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  try {
    console.log("[ai/chat] Iniciando solicitud para:", message);
    const reply = await generateSoulAiReply(message);
    console.log("[ai/chat] Respuesta recibida exitosamente");
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("[ai/chat] ERROR DETALLADO:", err);
    return NextResponse.json(
      {
        error: err.message || "Soule AI no está disponible en este momento. ¿Quieres hablar con una especialista por WhatsApp?",
      },
      { status: 503 },
    );
  }
}
