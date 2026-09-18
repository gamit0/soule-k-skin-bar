import { db } from "@/lib/db/client";

/**
 * Soule AI (Fase 11) — capa de servicio que arma el CONTEXTO real desde la
 * base de datos y se lo entrega al modelo. El modelo nunca recibe la
 * pregunta "pelada": siempre recibe también los cocktails y productos
 * reales disponibles, y una instrucción explícita de no inventar nada
 * fuera de esa lista. Esto es lo que cumple el requisito de "la IA nunca
 * inventa productos, precios ni disponibilidad" del documento de
 * arquitectura (sección H).
 */
export async function buildGroundedContext() {
  const cocktails = await db.query.cocktails.findMany({
    where: (c, { eq }) => eq(c.active, true),
  });
  const products = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.active, true),
  });

  return {
    cocktails: cocktails.map((c) => ({
      slug: c.slug,
      name: c.name,
      concerns: c.concerns,
      skinTypes: c.skinTypes,
      description: c.shortDescription,
    })),
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      routineStep: p.routineStep,
      stock: p.stock,
    })),
  };
}

const SYSTEM_PROMPT = `Eres Soule AI, la experta en skincare de Soule K Skin Bar.

SOBRE EL NEGOCIO:
- Soule K Skin Bar ofrece una experiencia de skincare personalizada basada en un motor de diagnóstico determinista (Cocktails).
- Nos especializamos en Cosmética Coreana (K-Beauty) original, seleccionando fórmulas con concentraciones clínicas de activos para resultados reales.
- Nuestro enfoque es la "estética de porcelana": piel luminosa, hidratada y saludable.
- El proceso ideal es: Quiz de Diagnóstico -> Recomendación de Cocktail -> Selección de Productos -> Compra.

REGLAS DE RESPUESTA (WEB):
- Tono: Elegante, profesional, cálido y cercano. Evita el lenguaje excesivamente robótico o el uso excesivo de emojis (usa 1 o 2 por mensaje máximo).
- Idioma: Español neutro y sofisticado.
- Honestidad: Si el usuario pregunta por algo que NO está en el contexto proporcionado, admite que no tienes esa información exacta y ofrece transferirlo con una especialista humana vía WhatsApp.
- Seguridad Médica: NO des diagnósticos médicos ni recetes medicamentos. Si detectas una condición dermatológica grave (acné quístico, dermatitis severa, etc.), sugiere visitar a un dermatólogo inmediatamente.
- Grounding: Solo recomienda cocktails y productos que aparezcan en el CONTEXTO. Nunca inventes precios, ingredientes ni existencias.

ESTRUCTURA DE RESPUESTA:
1. Saludo breve y empático.
2. Respuesta directa a la duda basada en el catálogo.
3. Llamado a la acción (CTA) sugerido: "Haz el quiz para un diagnóstico exacto" o "Añadir al carrito".`;

export async function generateSoulAiReply(userMessage: string) {
  const context = await buildGroundedContext();

  const getSimulationResponse = () => {
    const hasProducts = context.products.length > 0;
    const firstProduct = hasProducts ? context.products[0] : null;

    return `(Modo Simulación) ¡Hola! Como soy una IA, necesito una llave API activa para responderte en tiempo real, pero así es como respondería:

Basándome en tu perfil, te recomiendo empezar con el ${firstProduct ? firstProduct.name : "nuestro serum hidratante"}. Es ideal para tu tipo de piel y se aplica en la rutina ${firstProduct ? firstProduct.routineStep : "AM"}.

¿Te gustaría que te ayude a añadirlo al carrito o prefieres hablar con una especialista humana?`;
  };

  if (!process.env.GEMINI_API_KEY) {
    console.warn("[Soule AI] GEMINI_API_KEY no detectada. Usando modo de simulación.");
    return getSimulationResponse();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `SYSTEM INSTRUCTIONS: ${SYSTEM_PROMPT}\n\nCONTEXT (Catálogo real, no inventes nada fuera de esto):\n${JSON.stringify(context)}\n\nUSER MESSAGE: ${userMessage}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[Soule AI] Error de Gemini API, cayendo a simulación:", response.status, errorData);
      return getSimulationResponse();
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text ?? getSimulationResponse();
  } catch (error) {
    console.error("[Soule AI] Exception, cayendo a simulación:", error);
    return getSimulationResponse();
  }
}
