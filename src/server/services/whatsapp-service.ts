/**
 * WhatsAppService handles structured WhatsApp checkout and consultation URLs
 * for Soule K Skin Bar orders, diagnostics, cart items, and skin advice.
 *
 * SEGURIDAD: El número de WhatsApp se lee exclusivamente desde la variable de
 * entorno NEXT_PUBLIC_WHATSAPP_NUMBER. Si la variable no está configurada, las
 * funciones devuelven null y los componentes deben mostrar un estado
 * "pendiente de configuración". NO existe ningún número ficticio en el código.
 */

import { calcShipping } from "@/lib/shipping";

export interface WhatsAppDiagnosticPayload {
  diagnosticMood?: string;
  recommendedShotName?: string;
  cocktailName?: string;
  products: {
    name: string;
    brand?: string;
    price: number | string;
  }[];
  total: number;
}

export interface WhatsAppCartPayload {
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  customerNote?: string;
}

/** Devuelve el número de WhatsApp configurado, o null si no está disponible. */
function getWhatsAppNumber(): string | null {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null;
}

export function generateWhatsAppCheckoutUrl(
  data: WhatsAppDiagnosticPayload
): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) return null;

  const lines: string[] = [
    "✨ *HOLA SOULE K SKIN BAR* 💕",
    "Acabo de realizar mi *Diagnóstico K-Beauty* en la plataforma y quiero ordenar mi fórmula:",
    "",
  ];

  if (data.diagnosticMood) {
    lines.push(`🍸 *Mood de Piel:* ${data.diagnosticMood}`);
  }
  if (data.recommendedShotName) {
    lines.push(`🧪 *Shot de Tratamiento:* ${data.recommendedShotName}`);
  }
  if (data.cocktailName) {
    lines.push(`🧴 *Cocktail Diario Base:* ${data.cocktailName}`);
  }

  lines.push("");
  lines.push("🛍️ *Productos de mi Rutina:*");
  data.products.forEach((p, idx) => {
    const brandPrefix = p.brand ? `${p.brand} — ` : "";
    lines.push(`${idx + 1}. ${brandPrefix}${p.name} ($${Number(p.price).toFixed(2)} MXN)`);
  });

  lines.push("");
  lines.push(`💳 *Total Estimado:* $${data.total.toFixed(2)} MXN`);
  lines.push("");
  lines.push("¿Me podrían confirmar disponibilidad y los datos para realizar mi transferencia/pago? ✨");

  const message = lines.join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppCartCheckoutUrl(
  data: WhatsAppCartPayload
): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) return null;

  const shipping = calcShipping(data.subtotal);
  const total = data.subtotal + shipping;

  const lines: string[] = [
    "🛍️ *HOLA SOULE K SKIN BAR* 💕",
    "Quiero proceder con la compra de los productos en mi carrito:",
    "",
  ];

  data.items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. *${item.name}* x${item.quantity} — $${(item.price * item.quantity).toFixed(2)} MXN`
    );
  });

  lines.push("");
  lines.push(`💰 *Subtotal:* $${data.subtotal.toFixed(2)} MXN`);
  lines.push(
    `🚚 *Envío:* ${shipping === 0 ? "GRATIS 🎉" : `$${shipping.toFixed(2)} MXN`}`
  );
  lines.push(`💳 *Total:* $${total.toFixed(2)} MXN`);
  lines.push("");

  if (data.customerNote) {
    lines.push(`📝 *Nota:* ${data.customerNote}`);
    lines.push("");
  }
  lines.push("¿Me podrían indicar los pasos para completar mi pedido? ✨");

  const message = lines.join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppInquiryUrl(text: string): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) return null;

  const message = `Hola Soule K Skin Bar 💕\n\n${text}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export class WhatsAppService {
  static generateOrderMessage(data: {
    shotName: string;
    products: { name: string; price: string | number }[];
    total: string | number;
  }): string | null {
    return generateWhatsAppCheckoutUrl({
      recommendedShotName: data.shotName,
      products: data.products.map((p) => ({ name: p.name, price: Number(p.price) })),
      total: Number(data.total),
    });
  }

  static generateInquiryMessage(text: string): string | null {
    return generateWhatsAppInquiryUrl(text);
  }
}
