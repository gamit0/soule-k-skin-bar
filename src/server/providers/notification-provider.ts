/**
 * Interfaz de notificaciones. La implementación inicial (Fase 10) será un
 * deep link de WhatsApp (wa.me); más adelante se puede sustituir por la
 * API oficial de WhatsApp Business sin cambiar quién la consume.
 */
export interface NotificationMessage {
  to: string; // teléfono o email según el canal
  text: string;
  context?: Record<string, unknown>; // ej. resultado del quiz, cocktail recomendado
}

export interface NotificationProvider {
  buildContactLink(message: NotificationMessage): string;
  send?(message: NotificationMessage): Promise<void>; // no implementado hasta Fase 10+
}
