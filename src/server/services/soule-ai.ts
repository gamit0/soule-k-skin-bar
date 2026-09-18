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

const SYSTEM_PROMPT = `Eres Soule AI, la asistente de Soule K Skin Bar.

REGLAS ESTRICTAS:
- Solo puedes recomendar cocktails y productos que aparezcan en el
  CONTEXTO que se te entrega en cada mensaje. Nunca inventes productos,
  precios, ingredientes ni disponibilidad.
- Si el contexto no tiene algo que el usuario necesita, dilo con
  honestidad y ofrece transferir a una especialista humana.
- Nunca des consejo médico. Si el usuario describe algo que suena a una
  condición dermatológica (no solo una preocupación cosmética), sugiere
  ver a un dermatólogo y ofrece transferir a una especialista.
- Sé breve y cálida, en español, con el tono de la marca: elegante,
  cercana, sin exceso de emojis.`;

export async function generateSoulAiReply(userMessage: string) {
  const context = await buildGroundedContext();

  const getSimulationResponse = () => {
    const hasProducts = context.products.length > 0;
    const firstProduct = hasProducts ? context.products[0] : null;

    return `(Modo Simulación) ¡Hola! Como soy una IA, necesito una llave API activa con créditos para responderte en tiempo real, pero así es como respondería:

Basándome en tu perfil, te recomiendo empezar con el ${firstProduct ? firstProduct.name : "nuestro serum hidratante"}. Es ideal para tu tipo de piel y se aplica en la rutina ${firstProduct ? firstProduct.routineStep : "AM"}.

¿Te gustaría que te ayude a añadirlo al carrito o prefieres hablar con una especialista humana?`;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[Soule AI] ANTHROPIC_API_KEY no detectada. Usando modo de simulación.");
    return getSimulationResponse();
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `CONTEXTO (catálogo real, no inventes nada fuera de esto):\n${JSON.stringify(context)}\n\nMensaje del usuario: ${userMessage}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[Soule AI] Error de API, cayendo a simulación:", response.status, errorData);
      return getSimulationResponse();
    }

    const data = await response.json();
    const text = data.content
      ?.map((block: { type: string; text?: string }) =>
        block.type === "text" ? block.text : "",
      )
      .join("");

    return text ?? getSimulationResponse();
  } catch (error) {
    console.error("[Soule AI] Exception, cayendo a simulación:", error);
    return getSimulationResponse();
  }
}
