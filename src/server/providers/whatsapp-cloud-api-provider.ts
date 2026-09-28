import type {
  NotificationProvider,
  NotificationMessage,
} from "./notification-provider";

interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion?: string;
}

interface SendMessageResponse {
  messaging_product: "whatsapp";
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

/**
 * Implementación WhatsApp Cloud API (Meta Graph API).
 * Requiere: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID en variables de entorno.
 *
 * Para producción: completar Meta Business Verification y usar token permanente de System User.
 */
export class WhatsAppCloudApiProvider implements NotificationProvider {
  private config: WhatsAppConfig;
  private baseUrl: string;

  constructor() {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v20.0";

    if (!accessToken || !phoneNumberId) {
      throw new Error(
        "WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID son requeridas para WhatsApp Cloud API"
      );
    }

    this.config = { accessToken, phoneNumberId, apiVersion };
    this.baseUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}`;
  }

  buildContactLink(message: NotificationMessage): string {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) {
      throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER no está definida.");
    }
    const text = encodeURIComponent(message.text);
    return `https://wa.me/${number}?text=${text}`;
  }

  async send(message: NotificationMessage): Promise<void> {
    const to = this.normalizePhoneNumber(message.to);

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message.text },
    };

    await this.post("/messages", payload);
  }

  /**
   * Envía una plantilla aprobada (para notificaciones proactivas fuera de la ventana 24h)
   */
  async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string = "es_MX",
    components?: Array<{ type: string; parameters: unknown[] }>
  ): Promise<void> {
    const normalizedTo = this.normalizePhoneNumber(to);

    const payload = {
      messaging_product: "whatsapp",
      to: normalizedTo,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components || [],
      },
    };

    await this.post("/messages", payload);
  }

  /**
   * Envía mensaje interactivo (botones, lista, etc.)
   */
  async sendInteractive(
    to: string,
    interactive: {
      type: "button" | "list" | "product" | "product_list";
      header?: { type: "text" | "image" | "video" | "document"; text?: string; media_id?: string };
      body: { text: string };
      footer?: { text: string };
      action: {
        buttons?: Array<{ type: "reply"; reply: { id: string; title: string } }>;
        button?: string;
        sections?: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>;
      };
    }
  ): Promise<void> {
    const normalizedTo = this.normalizePhoneNumber(to);

    const payload = {
      messaging_product: "whatsapp",
      to: normalizedTo,
      type: "interactive",
      interactive,
    };

    await this.post("/messages", payload);
  }

  /**
   * Marca mensaje como leído (opcional, para UX)
   */
  async markAsRead(messageId: string): Promise<void> {
    await this.post("/messages", {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    });
  }

  private async post(endpoint: string, body: unknown): Promise<SendMessageResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `HTTP ${response.status}`;
      console.error("[WhatsAppCloudApiProvider] Error:", data);
      throw new Error(`WhatsApp API Error: ${errorMsg}`);
    }

    return data as SendMessageResponse;
  }

  private normalizePhoneNumber(phone: string): string {
    // Elimina +, espacios, guiones, paréntesis
    let cleaned = phone.replace(/[\s+\-()]/g, "");

    // Si empieza con 00, quitarlo
    if (cleaned.startsWith("00")) {
      cleaned = cleaned.slice(2);
    }

    // Si no tiene código de país, asumir México (52)
    if (!cleaned.startsWith("52") && cleaned.length === 10) {
      cleaned = "52" + cleaned;
    }

    return cleaned;
  }
}

/**
 * Factory para obtener el proveedor correcto según configuración
 */
export function getWhatsAppProvider(): NotificationProvider {
  const hasCloudApiConfig = process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (hasCloudApiConfig) {
    return new WhatsAppCloudApiProvider();
  }

  // Fallback a deep link (implementación actual)
  const { WhatsAppNotificationProvider } = require("./whatsapp-notification-provider");
  return new WhatsAppNotificationProvider();
}