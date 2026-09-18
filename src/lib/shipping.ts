/**
 * Configuración de envío de Soule K Skin Bar.
 * Esta es la única fuente de verdad para el cálculo de costo de envío.
 * Usar en: Cart UI, Checkout UI y mensajes de WhatsApp.
 */

export const FREE_SHIPPING_THRESHOLD = 1200; // MXN
export const SHIPPING_COST = 150; // MXN cuando el subtotal está por debajo del umbral

/**
 * Calcula el costo de envío basado en el subtotal del carrito.
 * Regla: subtotal >= 1200 MXN → envío gratis; subtotal < 1200 MXN → $150 MXN.
 */
export function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

/**
 * Calcula el total final (subtotal + envío).
 */
export function calcTotal(subtotal: number): number {
  return subtotal + calcShipping(subtotal);
}
