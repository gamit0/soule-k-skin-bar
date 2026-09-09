import type {
  NotificationProvider,
  NotificationMessage,
} from "./notification-provider";

/**
 * Implementación MVP (Fase 10): deep link a wa.me, sin API. Cuando se
 * quiera automatizar recordatorios de recompra hay que sustituir esto por
 * la integración con WhatsApp Business API (Meta Cloud API o un proveedor
 * como Twilio/360dialog) e implementar el método `send` — el resto del
 * sistema no necesita cambiar porque solo conoce la interfaz.
 */
export class WhatsAppNotificationProvider implements NotificationProvider {
  buildContactLink(message: NotificationMessage): string {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!number) {
      throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER no está definida.");
    }
    const text = encodeURIComponent(message.text);
    return `https://wa.me/${number}?text=${text}`;
  }
}
