# 🍸 SOULE K SKIN BAR — Análisis de Arquitectura y Roadmap

> Documento de planificación previo a desarrollo. No contiene código de producción.

---

## A. Product Architecture

El producto se organiza en **4 capas de experiencia** que convergen en el negocio de e-commerce:

```
┌─────────────────────────────────────────────┐
│  1. DISCOVERY   → Landing + Skin Quiz        │
│  2. DIAGNOSIS    → Recommendation Engine     │
│  3. ROUTINE      → Cocktail (AM/PM)          │
│  4. COMMERCE     → Cart → Checkout → Reorder │
└─────────────────────────────────────────────┘
```

Entidades de producto centrales (no técnicas, conceptuales):

| Entidad | Rol en el producto |
|---|---|
| **Product** | Ítem vendible, atómico. Pertenece a categorías, tiene atributos de piel. |
| **Cocktail** | Agrupador curado de productos + reglas + rutina. Es la "unidad de venta emocional". |
| **Quiz** | Motor de preguntas configurable, produce respuestas con peso. |
| **Recommendation** | Resultado calculado (scoring) que mapea respuestas → Cocktail(s). |
| **Customer** | Usuario con historial, piel, cocktails recomendados y compras. |
| **Order** | Transacción, ligada a Customer y a los Products/Cocktail comprados. |

Principio de diseño de producto: **el Cocktail es una capa de presentación y curaduría sobre Products**, nunca un tipo de producto distinto. Esto permite que un mismo producto (ej. un serum) participe en varios cocktails sin duplicar inventario.

---

## B. Technical Architecture

**Patrón general:** Monolito modular en Next.js (App Router) con separación estricta de capas. Se evita microservicios prematuros — no se justifican para el volumen inicial, y complican el MVP.

```
┌───────────────────────────────────────────┐
│              Next.js App Router            │
│  ┌───────────┐   ┌────────────────────┐   │
│  │  UI Layer │→→ │  Server Actions /   │   │
│  │ (React)   │   │  Route Handlers     │   │
│  └───────────┘   └─────────┬──────────┘   │
│                              │              │
│                    ┌─────────▼─────────┐   │
│                    │   Service Layer    │   │
│                    │ (business logic)   │   │
│                    └─────────┬─────────┘   │
│                              │              │
│                    ┌─────────▼─────────┐   │
│                    │  Data Access Layer │   │
│                    │  (Prisma/Drizzle)  │   │
│                    └─────────┬─────────┘   │
└──────────────────────────────┼─────────────┘
                                │
                     ┌──────────▼─────────┐
                     │     PostgreSQL      │
                     └──────────────────────┘
```

Capas externas desacopladas mediante interfaces (para poder sustituirlas sin tocar el core):

- **PaymentProvider** — interfaz abstracta; implementación inicial = Stripe.
- **NotificationProvider** — interfaz abstracta; implementación inicial = WhatsApp deep link, luego API oficial.
- **RecommendationEngine** — interfaz abstracta; implementación inicial = scoring por reglas, luego AI-assisted.
- **StorageProvider** — interfaz abstracta sobre S3-compatible (imágenes de producto).

Esto es lo que permite que, en la Fase 11 (AI), se reemplace el motor de recomendación sin reescribir el resto del sistema.

**Decisión de stack — validación:**

Tu propuesta (Next.js + TS, Tailwind, PostgreSQL, Prisma/Drizzle, Auth.js, Stripe, S3, Vercel) es sólida y estándar para este tipo de producto en 2026. No propongo cambios estructurales. Dos matices:

- **Prisma vs Drizzle:** recomiendo **Drizzle** por ser más ligero, con mejor control SQL directo (útil para el scoring engine, que hace queries algo más complejas) y mejor rendimiento en edge/serverless. Prisma es válido si prefieres DX más "batteries included" y no te preocupa el overhead.
- **Auth.js**: correcto para email/password + OAuth (Google) desde el día uno del admin y clientes.

---

## C. Database Schema (conceptual, no DDL final)

```
Product
 ├─ id, slug, name, brand
 ├─ description, shortDescription
 ├─ price, compareAtPrice, currency
 ├─ images[] (ProductImage)
 ├─ categoryId → Category
 ├─ skinTypes[] (enum: dry, oily, combination, normal, sensitive)
 ├─ concerns[] (enum: acne, darkSpots, dehydration, aging, texture, dullness, pores, oiliness)
 ├─ ingredients[]
 ├─ benefits[]
 ├─ routineStep (enum: cleanser, serum, moisturizer, sunscreen, treatment)
 ├─ usage (enum: AM, PM, BOTH)
 ├─ stock, active, isMock (bool — flag explícito de datos de prueba)
 └─ timestamps

Cocktail
 ├─ id, slug, name, icon, image
 ├─ description, shortDescription
 ├─ concerns[], skinTypes[]
 ├─ CocktailProduct[] (join table: cocktailId, productId, routine: AM|PM, step, order)
 └─ active, timestamps

QuizQuestion
 ├─ id, order, text, type (single|multi), active
 └─ QuizOption[]

QuizOption
 ├─ id, questionId, label, value
 └─ QuizOptionWeight[] (optionId, cocktailId, weight)

QuizResponse (por sesión/usuario)
 ├─ id, customerId (nullable si es guest), sessionId
 ├─ answers (JSON: questionId → optionId[])
 └─ createdAt

RecommendationResult
 ├─ id, quizResponseId, customerId
 ├─ primaryCocktailId, secondaryCocktailId
 ├─ scoreBreakdown (JSON: cocktailId → score%)
 └─ createdAt

Customer
 ├─ id, name, email, phone
 ├─ skinType, concerns[]
 ├─ authProviderId (Auth.js)
 ├─ lastPurchaseAt, totalOrders, totalSpent
 └─ timestamps

Order / OrderItem
 ├─ Order: id, customerId, status, subtotal, discount, total, couponId, paymentStatus, paymentProviderRef
 └─ OrderItem: orderId, productId, quantity, unitPrice, cocktailId (nullable — si vino de un cocktail)

Coupon
 ├─ id, code, type (percent|fixed), value, expiresAt, usageLimit

Wishlist
 ├─ customerId, productId[]

AdminUser
 ├─ id, email, role (super_admin|editor|support), authProviderId
```

Notas de diseño:
- `isMock` en Product es obligatorio en Fase 3 para distinguir datos de prueba de datos reales — se puede filtrar/ocultar en producción.
- El scoring se guarda desnormalizado en `RecommendationResult.scoreBreakdown` para no tener que recalcular en cada visita al historial del cliente.
- `OrderItem.cocktailId` permite reportes tipo "qué cocktails generan más ventas" sin joins complejos.

---

## D. User Flows

**Flujo principal (visitante → cliente):**

```
Landing (Instagram/TikTok ad) 
  → CTA "Descubre tu Cocktail"
  → Skin Quiz (6 preguntas, guest permitido)
  → Cálculo de scoring
  → Pantalla de resultado (Cocktail primario + secundario)
  → Rutina AM/PM con productos reales del catálogo
  → [Opción A] "Comprar mi Cocktail" → agrega todo el cocktail al carrito → checkout
  → [Opción B] "Hablar con una especialista" → WhatsApp deep link con contexto del quiz
  → Checkout (guest o cuenta) → pago (Stripe) → confirmación
  → Cuenta creada/asociada → rutina guardada en perfil
```

**Flujo de recompra:**

```
Cliente con compra > N días
  → Trigger (email/WhatsApp, Fase 10+) 
  → "¿Tu cocktail necesita refill?"
  → Landing personalizada con su cocktail guardado
  → Recompra en 1 clic (mismo carrito, mismos productos/cantidades)
```

**Flujo de cuenta:**

```
Registro/Login (Auth.js)
  → Dashboard cliente: mi rutina, mis pedidos, wishlist, reordenar
  → Retomar quiz si su piel cambió
```

---

## E. Admin Flows

```
Login admin (rol-based: super_admin, editor, support)
  → Dashboard: ventas, pedidos recientes, productos más vendidos, quiz completions
  → Productos: CRUD, stock, precio, imágenes, activar/desactivar
  → Cocktails: CRUD, asociar productos a rutina AM/PM, configurar concerns/skinTypes
  → Quiz Builder: crear preguntas, opciones, asignar pesos a cocktails, reordenar, activar/desactivar
  → Pedidos: ver detalle, cambiar estado (pending→paid→shipped→delivered), reembolsos
  → Clientes: ficha 360° (quiz results, cocktails recomendados, historial, LTV, WhatsApp)
  → Cupones: crear/gestionar
  → Reportes: funnel de analytics (visitas→quiz→resultado→compra)
```

Control de permisos: `super_admin` (todo), `editor` (productos/cocktails/quiz, no usuarios/pagos), `support` (solo lectura + WhatsApp/clientes).

---

## F. Skin Quiz Architecture

El quiz se modela como **configuración de datos, no como código hardcodeado**. Esto permite que el admin agregue/edite preguntas sin deploys.

```
QuizEngine
 ├─ fetchActiveQuestions() → ordenadas por `order`
 ├─ renderer genérico (single-select, multi-select) — un solo componente reutilizable
 ├─ collectAnswers() → guarda en QuizResponse (localStorage si es guest, luego se liga a Customer si se registra)
 └─ submit() → dispara ScoringEngine
```

Ventaja clave: agregar la "Pregunta 7" en el futuro es una operación de admin panel (crear QuizQuestion + QuizOptions + pesos), no un cambio de código.

---

## G. Recommendation Engine (Scoring System)

**V1 — reglas explícitas (determinístico, auditable):**

```
function calculateScores(answers, weightsTable):
  scores = { cocktailId: 0, ... }
  for each answer in answers:
    for each weight in weightsTable[answer.optionId]:
      scores[weight.cocktailId] += weight.value

  normalize scores → percentages (0-100%)
  primary = highest score
  secondary = second highest, si score >= threshold (ej. 50% del primario)

  return { primary, secondary, scoreBreakdown }
```

Reglas de negocio explícitas:
- Umbral mínimo para mostrar un cocktail secundario (evita combinaciones ruidosas con score muy bajo).
- Empates: desempatar por prioridad configurable en el admin (ej. Acne > Hydration en empate).
- Auditable: cada resultado guarda el `scoreBreakdown` completo — se puede explicar "por qué" a soporte/cliente.

**V2 — con AI (Fase 11):** la IA no reemplaza el scoring, lo **envuelve**. Recibe el `scoreBreakdown` calculado + el texto libre del usuario (si lo hay) y solo puede:
1. Elegir entre los cocktails que el scoring ya calculó (no inventa nuevos).
2. Explicar el resultado en lenguaje natural.
3. Pedir aclaraciones si el scoring es ambiguo (dos cocktails muy cerca en %).

Esto cumple tu requisito de "la IA nunca inventa productos ni reglas": la IA opera sobre la salida del motor determinístico, no sobre el catálogo crudo.

---

## H. Future AI Architecture (Soule AI)

```
User message (free text)
  → Intent extraction (¿describe piel? ¿pide producto? ¿pide ayuda humana?)
  → Si faltan datos → pregunta de clarificación (máx 1-2 preguntas, no interrogatorio)
  → Mapea intención a las mismas dimensiones del Quiz (concerns, skinType)
  → Llama al ScoringEngine (mismo motor que el quiz visual)
  → Genera respuesta en lenguaje natural citando SOLO productos/cocktails reales de la DB
  → Ofrece: agregar al carrito / ver rutina completa / hablar con especialista
  → Handoff a humano si: baja confianza, petición médica, queja, o el usuario lo pide
```

Restricción de arquitectura (grounding obligatorio): el prompt de sistema de la IA debe recibir el catálogo relevante (productos/cocktails ya filtrados por el scoring) como contexto inyectado — nunca debe generar desde conocimiento general. Esto es una decisión de arquitectura, no solo de prompt: la capa de servicio arma el contexto, la IA solo redacta sobre lo que se le entrega.

---

## I. WhatsApp Architecture

**Fase inicial (MVP):** deep link `https://wa.me/<numero>?text=<mensaje precargado>`, sin API. El mensaje precargado incluye contexto: "Hola, hice el Skin Quiz y mi resultado fue Acne + Hydration Cocktail".

**Fase posterior:** integración con WhatsApp Business API (Meta Cloud API o proveedor como Twilio/360dialog) para:
- Recordatorios de recompra automatizados.
- Chatbot conectado al mismo `RecommendationEngine`.
- Handoff a agente humano cuando el bot no puede resolver.

Se diseña `NotificationProvider` como interfaz desde el día uno para que este cambio no rompa nada del resto del sistema.

---

## J. Payment Architecture

```
CheckoutService
 ├─ createOrder() → status: pending
 ├─ PaymentProvider.createIntent(order) → Stripe Payment Intent
 ├─ webhook /api/webhooks/stripe → verifica firma → actualiza Order.status
 └─ on success → decrementa stock, dispara email confirmación, limpia carrito
```

- Interfaz `PaymentProvider` desacoplada para poder sumar métodos populares en México (ej. OXXO Pay vía Stripe, o Mercado Pago) sin tocar `CheckoutService`.
- Webhooks siempre como fuente de verdad del estado de pago (nunca confiar solo en el redirect del cliente).
- Idempotencia en webhooks (evitar procesar el mismo evento dos veces).

---

## K. Folder Structure (propuesta)

```
/src
  /app
    /(marketing)/            → landing, cocktails, about
    /(shop)/products/[slug]
    /(shop)/cart
    /(shop)/checkout
    /quiz/
    /account/                → dashboard, orders, wishlist
    /admin/
      /products /cocktails /quiz /orders /customers /coupons
    /api/
      /webhooks/stripe
      /quiz/submit
      /recommendation
  /components
    /ui/                     → primitives (button, input, etc.)
    /product/
    /cocktail/
    /quiz/
    /admin/
  /server
    /services/               → business logic (product, cocktail, scoring, order, customer)
    /repositories/            → data access (Drizzle/Prisma queries)
    /providers/               → PaymentProvider, NotificationProvider, StorageProvider (interfaces + impls)
  /lib                        → auth, db client, utils, validation (zod)
  /types                      → shared TS types
  /mock-data                  → productos y cocktails mock (Fase 1-4)
/prisma or /drizzle            → schema, migrations
```

---

## L. Development Roadmap

| Fase | Contenido | Entregable clave |
|---|---|---|
| **1. Foundation** | Setup Next.js+TS, Tailwind, DB, ORM, estructura de carpetas, CI básico | Repo corriendo, deploy en Vercel |
| **2. Landing Page** | Hero, "qué necesita tu piel", cómo funciona, productos destacados, testimonios (estructura), footer | Landing responsive mobile-first |
| **3. Products** | Modelo Product, catálogo, PDP, categorías, datos mock claramente marcados | Catálogo navegable |
| **4. Skin Quiz** | QuizQuestion/Option, UI genérica de preguntas, guardado de respuestas | Quiz funcional end-to-end (sin scoring aún) |
| **5. Recommendation Engine** | Modelo de pesos, ScoringEngine V1, pantalla de resultado con rutina AM/PM | Resultado de cocktail funcionando con datos mock |
| **6. Cart / Checkout** | Carrito, "comprar cocktail completo", checkout, Stripe, webhooks | Compra end-to-end funcional |
| **7. Authentication** | Auth.js, cuentas cliente, dashboard básico (pedidos, rutina guardada) | Login/registro + perfil |
| **8. Admin** | CRUD productos, cocktails, quiz builder, gestión de pedidos y clientes, permisos por rol | Panel admin operativo |
| **9. CRM** | Ficha de cliente 360°, segmentación básica ("no compra hace 60 días") | Vista de clientes enriquecida |
| **10. WhatsApp** | Deep links con contexto, luego evaluación de API oficial | Botón "hablar con especialista" funcional |
| **11. AI (Soule AI)** | Chat conectado al ScoringEngine existente, grounding estricto en DB | Asistente conversacional MVP |
| **12. Analytics** | Tracking de funnel (visita→quiz→resultado→compra), eventos de WhatsApp/Instagram | Dashboard de funnel en admin |
| **13. Production hardening** | Rate limiting, logging, seguridad, revisión de permisos, carga de productos reales, SEO/schema, sitemap | Lanzamiento a producción |

**Regla de avance:** no se pasa de fase con errores críticos de build, TypeScript o lint pendientes. Cada fase se cierra con: explicación de lo construido → archivos tocados → build/lint/typecheck verificados → resumen.

---

## Próximo paso sugerido

Antes de tocar código, conviene confirmar contigo tres decisiones que afectan el schema desde el día uno:

1. **Drizzle vs Prisma** — ¿tienes preferencia, o seguimos con Drizzle por las razones dadas en la sección B?
2. **Guest checkout** — ¿el usuario puede comprar sin crear cuenta (con creación de cuenta post-compra), o cuenta obligatoria antes de pagar?
3. **Alcance de la Fase 1** — ¿arrancamos ya con el repo `gamit0/gamit0-site` y el project board que compartiste, o prefieres que primero valide la estructura de carpetas contigo antes de hacer el primer commit?

Con eso confirmado, la Fase 1 (Foundation) puede arrancar.
