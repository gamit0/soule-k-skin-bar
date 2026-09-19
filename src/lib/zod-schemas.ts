import { z } from "zod";

/**
 * Validation schemas for API inputs using Zod
 * All user-facing API endpoints should validate with these schemas
 */

// Checkout validation
export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive().max(99),
      cocktailId: z.string().uuid().optional(),
    })
  ).min(1, "El carrito no puede estar vacío"),
  guestEmail: z.string().email("Email inválido").optional(),
  guestPhone: z.string().regex(/^[\d\s\-\+\(\)]{8,}$/, "Teléfono inválido").optional(),
  shippingAddress: z.object({
    name: z.string().min(2, "Nombre requerido"),
    street: z.string().min(5, "Dirección requerida"),
    city: z.string().min(2, "Ciudad requerida"),
    state: z.string().min(2, "Estado requerido"),
    postalCode: z.string().regex(/^\d{5}$/, "Código postal inválido (5 dígitos)"),
    country: z.string().default("MX"),
  }).optional(),
});

// Quiz submission validation
export const quizSubmitSchema = z.object({
  answers: z.record(
    z.string().uuid(),
    z.array(z.string().uuid()).min(1, "Selecciona al menos una opción")
  ),
  sessionId: z.string().min(1, "Session ID requerido"),
});

// Product creation/update validation
export const productCreateSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(200),
  brand: z.string().max(120).optional().default("Soule Lab"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Precio inválido"),
  shortDescription: z.string().max(280).optional(),
  description: z.string().optional(),
  routineStep: z.enum(["cleanser", "toner", "serum", "eye_cream", "moisturizer", "sunscreen", "treatment", "special_care"]),
  usage: z.enum(["AM", "PM", "BOTH"]).default("BOTH"),
  stock: z.number().int().nonnegative().default(0),
  skinTypes: z.array(z.enum(["dry", "oily", "combination", "normal", "sensitive", "all"])).default([]),
  concerns: z.array(z.enum(["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness", "sunProtection"])).default([]),
});

// Shot creation/update validation
export const shotCreateSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(160),
  menuTitle: z.string().max(160).optional(),
  subtitle: z.string().max(280).optional(),
  category: z.string().max(120).optional(),
  description: z.string().optional(),
  icon: z.string().max(60).optional().default("✨"),
  mood: z.enum(["Calm", "Glow", "Clean", "Hydrated", "Firm"]).default("Glow"),
  concerns: z.array(z.enum(["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness", "sunProtection"])).default([]),
  skinTypes: z.array(z.enum(["dry", "oily", "combination", "normal", "sensitive"])).default([]),
});

// Cocktail creation/update validation
export const cocktailCreateSchema = z.object({
  name: z.string().min(2, "Nombre requerido").max(160),
  shortDescription: z.string().max(280).optional(),
  description: z.string().optional(),
  icon: z.string().max(60).optional().default("✨"),
  image: z.string().url().optional().or(z.literal("")),
  concerns: z.array(z.enum(["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness", "sunProtection"])).default([]),
  skinTypes: z.array(z.enum(["dry", "oily", "combination", "normal", "sensitive", "all"])).default([]),
});

// Quiz question/option validation
export const quizQuestionSchema = z.object({
  text: z.string().min(5, "Texto muy corto").max(280),
  type: z.enum(["single", "multi"]).default("single"),
  order: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true),
});

export const quizOptionSchema = z.object({
  questionId: z.string().uuid(),
  label: z.string().min(1).max(160),
  value: z.string().min(1).max(60),
});

// Type exports for inference
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ShotCreateInput = z.infer<typeof shotCreateSchema>;
export type CocktailCreateInput = z.infer<typeof cocktailCreateSchema>;
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>;
export type QuizOptionInput = z.infer<typeof quizOptionSchema>;