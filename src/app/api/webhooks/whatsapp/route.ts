import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "soule-k-verify-token";
const N8N_WHATSAPP_WEBHOOK_URL = process.env.N8N_WHATSAPP_WEBHOOK_URL;

/**
 * GET: Verificación del webhook (Meta llama esto al configurar)
 * Meta envía: ?hub.mode=subscribe&hub.challenge=XXX&hub.verify_token=YYY
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] Verificación exitosa");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp Webhook] Verificación fallida:", { mode, token });
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST: Recibe mensajes entrantes de WhatsApp
 * Meta envía el payload del mensaje
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[WhatsApp Webhook] Payload recibido:", JSON.stringify(body, null, 2));

    // Validar estructura básica de WhatsApp Business API
    if (!body.entry || !Array.isArray(body.entry)) {
      return NextResponse.json({ status: "ok" });
    }

    // Procesar cada entry (normalmente 1)
    for (const entry of body.entry) {
      if (!entry.changes || !Array.isArray(entry.changes)) continue;

      for (const change of entry.changes) {
        if (change.field !== "messages") continue;

        const value = change.value;
        if (!value.messages || !Array.isArray(value.messages)) continue;

        // Procesar cada mensaje entrante
        for (const message of value.messages) {
          await processIncomingMessage(message, value.contacts?.[0]);
        }

        // Procesar statuses (delivered, read, failed)
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const status of value.statuses) {
            console.log("[WhatsApp Webhook] Status update:", status);
            // Opcional: forward a n8n para tracking
            if (N8N_WHATSAPP_WEBHOOK_URL) {
              await forwardToN8n({
                type: "status_update",
                status,
                timestamp: Date.now(),
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error:", error);
    // Siempre responder 200 a Meta para evitar reintentos infinitos
    return NextResponse.json({ status: "ok" });
  }
}

interface IncomingMessage {
  id: string;
  from: string;
  timestamp: string;
  type: "text" | "image" | "document" | "audio" | "video" | "location" | "contacts" | "button" | "list_reply" | "order" | "interactive";
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; caption?: string };
  document?: { id: string; mime_type: string; sha256: string; filename?: string; caption?: string };
  audio?: { id: string; mime_type: string; sha256: string };
  video?: { id: string; mime_type: string; sha256: string; caption?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  interactive?: {
    type: "button_reply" | "list_reply";
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  button?: { payload: string; text: string };
}

interface Contact {
  profile?: { name: string };
  wa_id: string;
}

async function processIncomingMessage(message: IncomingMessage, contact?: Contact) {
  const from = message.from;
  const messageId = message.id;
  const timestamp = parseInt(message.timestamp) * 1000; // Unix seconds to ms
  const contactName = contact?.profile?.name || "Cliente";

  let content: string;
  let messageType = message.type;

  switch (message.type) {
    case "text":
      content = message.text?.body || "";
      break;
    case "image":
      content = `[Imagen] ${message.image?.caption || ""}`;
      break;
    case "document":
      content = `[Documento: ${message.document?.filename || "archivo"}] ${message.document?.caption || ""}`;
      break;
    case "audio":
      content = "[Mensaje de voz]";
      break;
    case "video":
      content = `[Video] ${message.video?.caption || ""}`;
      break;
    case "location":
      content = `[Ubicación: ${message.location?.latitude}, ${message.location?.longitude}]`;
      break;
    case "interactive":
      if (message.interactive?.type === "button_reply") {
        content = `Botón: ${message.interactive.button_reply?.title} (${message.interactive.button_reply?.id})`;
      } else if (message.interactive?.type === "list_reply") {
        content = `Lista: ${message.interactive.list_reply?.title} (${message.interactive.list_reply?.id})`;
      } else {
        content = "[Interactivo]";
      }
      break;
    case "button":
      content = `Botón legacy: ${message.button?.text} (${message.button?.payload})`;
      break;
    default:
      content = `[Tipo no soportado: ${message.type}]`;
  }

  // Construir payload para n8n
  const n8nPayload = {
    type: "incoming_message",
    message: {
      id: messageId,
      from,
      contactName,
      content,
      messageType,
      timestamp: new Date(timestamp).toISOString(),
      raw: message, // Incluir raw por si n8n necesita más datos
    },
  };

  // Enviar a n8n
  if (N8N_WHATSAPP_WEBHOOK_URL) {
    await forwardToN8n(n8nPayload);
  } else {
    console.warn("[WhatsApp Webhook] N8N_WHATSAPP_WEBHOOK_URL no configurado, mensaje no reenviado");
  }
}

async function forwardToN8n(payload: unknown): Promise<void> {
  if (!N8N_WHATSAPP_WEBHOOK_URL) return;

  try {
    const response = await fetch(N8N_WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si tu n8n requiere autenticación, agregar header aquí
        // "Authorization": `Bearer ${process.env.N8N_WEBHOOK_AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[WhatsApp Webhook] Error enviando a n8n:", response.status, await response.text());
    } else {
      console.log("[WhatsApp Webhook] Mensaje reenviado a n8n exitosamente");
    }
  } catch (error) {
    console.error("[WhatsApp Webhook] Error de red enviando a n8n:", error);
  }
}