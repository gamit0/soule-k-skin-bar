/**
 * Configuración explícita de asociación Shot → Cocktail Base para Soule K Skin Bar.
 *
 * FUENTE: SOULE_SKIN_MENU_2026_FINAL.pdf — sección "Menú de Shots" y "Cocktails Diarios".
 * REGLA: La asociación se basa en el Mood compartido entre el Shot y el Cocktail.
 *        NO se infieren asociaciones no respaldadas por el menú oficial.
 *
 * Si un Shot no aparece en este mapa, el engine usa el fallback de Mood (moodFallbackCocktailSlug).
 * Esto preserva la extensibilidad sin código condicional (sin if/else por shot).
 */

export interface ShotCocktailEntry {
  /** Slug del Cocktail Base recomendado para este Shot */
  cocktailSlug: string;
  /**
   * Cocktail alternativo cuando el usuario ya tiene el base, o para
   * mostrar una segunda opción en el resultado del diagnóstico.
   * Opcional — sólo si el menú define una asociación secundaria.
   */
  alternateCocktailSlug?: string;
}

/**
 * Mapa Shot ID → Cocktail Base.
 * Asociaciones extraídas del SOULE_SKIN_MENU_2026_FINAL.pdf.
 * Mood Firm → age-well (antiedad/firmeza)
 * Mood Calm → calm (calmante/barrera)
 * Mood Glow → even-tone (unificador de tono)
 * Mood Hydrated → hydration (hidratación profunda)
 * Mood Clean → oil-control (control de sebo/poros)
 */
export const SHOT_COCKTAIL_MAP: Record<string, ShotCocktailEntry> = {
  "shot-ojos-fresh": {
    cocktailSlug: "age-well",
    // Ojos Fresh → Mood Firm. age-well es el cocktail antiedad oficial del menú.
  },
  "shot-piel-tranquila": {
    cocktailSlug: "calm",
    // Piel Tranquila → Mood Calm. Cocktail calmante directo.
  },
  "shot-adios-manchitas": {
    cocktailSlug: "even-tone",
    // Adiós Manchitas → Mood Glow. even-tone es el cocktail unificador de tono del menú.
  },
  "shot-hidra-power": {
    cocktailSlug: "hydration",
    // Hidra Power → Mood Hydrated. hydration es el cocktail de hidratación del menú.
  },
  "shot-bye-brotes": {
    cocktailSlug: "pore-care",
    alternateCocktailSlug: "oil-control",
    // Bye Brotes → Mood Clean. pore-care es la ruta de tratamiento diario del menú;
    // oil-control es el cocktail base para control de sebo (alternativo).
  },
  "shot-piel-smooth": {
    cocktailSlug: "age-well",
    // Piel Smooth → Mood Firm. age-well es el cocktail antiedad oficial del menú.
  },
};

/**
 * Fallback por Mood cuando un Shot no aparece en SHOT_COCKTAIL_MAP.
 * Garantiza que el engine siempre resuelve un cocktail válido.
 * Asociaciones también basadas en el SOULE_SKIN_MENU_2026_FINAL.pdf.
 */
export const MOOD_FALLBACK_COCKTAIL_MAP: Record<string, string> = {
  Firm: "age-well",
  Calm: "calm",
  Glow: "even-tone",
  Hydrated: "hydration",
  Clean: "pore-care",
};

/**
 * Resuelve el slug del Cocktail Base para un Shot dado su ID y su Mood.
 * Consulta primero SHOT_COCKTAIL_MAP (fuente primaria, por shot).
 * Si no hay entrada, usa MOOD_FALLBACK_COCKTAIL_MAP (fallback por Mood).
 * Si tampoco hay Mood, devuelve "hydration" como último recurso de MVP.
 */
export function resolveCocktailSlug(shotId: string, shotMood?: string): string {
  const byShot = SHOT_COCKTAIL_MAP[shotId];
  if (byShot) return byShot.cocktailSlug;

  if (shotMood) {
    const byMood = MOOD_FALLBACK_COCKTAIL_MAP[shotMood];
    if (byMood) return byMood;
  }

  return "hydration";
}
