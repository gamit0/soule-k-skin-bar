# SOULE K SKIN BAR — PRODUCTION AUDIT

## 1. Estado general
El proyecto es una plataforma e-commerce de skincare personalizado (K-Beauty) construida con Next.js 15 (App Router), TypeScript, Tailwind v4, Drizzle ORM y PostgreSQL (Neon/Supabase). **El sitio está desplegado en Vercel** (https://soule-k-skin-bar.vercel.app/) y el repositorio está en GitHub (https://github.com/gamit0/soule-k-skin-bar).

**Estado real:** MVP funcional con gaps críticos para producción real. El flujo completo (Quiz → Recomendación → Carrito → Checkout Stripe → WhatsApp fallback) existe pero tiene bloqueadores:
- **Pagos Stripe**: No funcionan en producción (falta STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
- **Base de datos**: Esquema completo en Drizzle, migraciones existen, seed funcional, pero **el catálogo real usa mock-data como fallback** en casi todos los repositorios
- **Admin**: Existe `/admin` con CRUD mínimo (crear/toggle/delete productos, crear cocktails, crear preguntas quiz, actualizar estado órdenes), pero **falta edición completa, asociación productos-cocktails, gestión imágenes, usuarios admin**
- **Quiz/Engine**: Motor determinístico rule-based en mock-data; **pesos de scoring NO están en PostgreSQL** (tabla `quiz_option_weights` ignorada)
- **WhatsApp**: Solo `wa.me` deep links (sin API Business); **MaviBot** integrado como widget third-party
- **Seguridad**: Credenciales provider sin hash de password; rate limiting en memoria; secretos en `.env` commiteado

---

## 2. Lo que YA funciona
- ✅ Sitio público renderizado (SSR/SSG/ISR mixto) con diseño K-Beauty coherente (Fraunces/Inter, tokens Tailwind v4)
- ✅ Quiz de 4 preguntas con 25 opciones, scoring determinístico por pesos `shotWeights`/`moodWeights` en mock-data
- ✅ Motor de recomendación: Shot primario/secundario + Cocktail base + rutinas AM/PM + Match Score (88-99)
- ✅ Catálogo de 120+ productos en mock-data con precios, ingredientes, concerns, skinTypes, stock
- ✅ 6 Shots y 9 Cocktails definidos con mapeo explícito Shot→Cocktail por mood
- ✅ Carrito persistido en localStorage (add/remove/qty, subtotal, envío gratis ≥ $1,200 MXN / $150 MXN)
- ✅ Checkout Stripe **server-side**: validación precio/stock, cálculo envío, creación orden + paymentIntent
- ✅ Webhook Stripe: actualiza orden a `paid` en `payment_intent.succeeded`
- ✅ Páginas: Home, Productos, Producto detalle, Shots (lista + detalle), Quiz, Resultado, Cocktail detalle, Cart, Checkout, Login, Admin dashboard, Legal/FAQ/Contacto
- ✅ Auth NextAuth v5 (Google + Credentials placeholder), `requireAdmin()` guard en rutas `/admin`
- ✅ Analytics fire-and-forget (sessionId localStorage → `/api/analytics/track` → PostgreSQL)
- ✅ Chat IA custom (`/api/ai/chat` → Gemini 1.5 Flash con grounded context) + MaviBot widget
- ✅ WhatsApp deep links en: carrito, producto, quiz resultado, contacto, especialista
- ✅ Build Next.js exitoso (`.next/` existe), Git limpio (branch main up-to-date con origin)

---

## 3. Lo que está PARCIAL
| Área | Qué funciona | Qué falta / incompleto |
|------|-------------|------------------------|
| **Pagos** | Checkout API crea paymentIntent, valida precio/stock server-side, webhook actualiza orden | Variables Stripe vacías; **Stripe Elements no montado en payment-form.tsx** (falta `apiVersion` en constructor Stripe v17); sin páginas success/cancel personalizadas |
| **Neon/PostgreSQL** | Schema Drizzle completo (29 tablas), 2 migraciones, seed TS funcional, repositorios con fallback a mock | **Catálogo usa mock-data como fuente real**; shots no son entidad DB separada (shot-repository lee `cocktails`); quiz weights en DB ignorados |
| **Admin** | Rutas existen, layout + nav, requireAdmin(), create/delete/toggle productos, create cocktails, create quiz questions, update order status | **Sin edición completa** (precio, descripción, imágenes, skinTypes, concerns, etc.); **sin UI asociación productos↔cocktails**; **sin gestión usuarios admin**; **sin seed admin inicial** |
| **Quiz/Engine** | Flujo completo determinístico, Shot primario/secundario, Cocktail por mood, rutinas AM/PM | Pesos solo en mock-data (DB ignorado); Match Score clamp artificial (88-99); Shots no entidad DB; seed quiz ≠ mock-data |
| **WhatsApp** | wa.me links generados dinámicamente con contexto (shot, cocktail, productos, total) | **Sin WhatsApp Business API** (no automatización); un fallback hardcodeado en especialista/page.tsx |
| **MaviBot** | Widget cargado vía script injection (`mavibot.ai`) | No integrado con catálogo real; GUID hardcodeado; aparece en `ExternalChatBot` pero ¿dónde se renderiza? |
| **Imágenes** | 7 imágenes locales en `public/products/`, script para sincronizar DB | **Sin og-image.jpg** (referenciado en layout); product-images table usa URLs externas en seed |
| **Build/CI** | `npm run build` pasa localmente | **lint/typecheck nunca corridos** (DOC-PENDIENTES.md); sin ESLint config; sin Vercel config; sin GitHub Actions |

---

## 4. Lo que FALTA
### Crítico para ecommerce real
- [ ] **Variables Stripe en producción** (Secret, Webhook Secret, Publishable Key)
- [ ] **Stripe Elements montado correctamente** (PaymentElement en payment-form.tsx)
- [ ] **Migración catálogo real a Neon** (productos, shots, cocktails, quiz questions/weights)
- [ ] **Admin CRUD completo** (editar producto, imágenes, asociaciones, usuarios admin)
- [ ] **WhatsApp Business API** (o aceptar solo wa.me manual)
- [ ] **Credenciales provider seguro** (bcrypt/argon2) o deshabilitar
- [ ] **Rate limiting distribuido** (Upstash Redis / Vercel Edge Config)
- [ ] **ESLint config + typecheck + lint en CI**
- [ ] **vercel.json + proyecto Vercel linkado + env vars por ambiente**
- [ ] **sitemap.ts baseUrl corregido** + páginas dinámicas en sitemap
- [ ] **og-image.jpg en public/**

### Importante
- [ ] Shot como entidad DB separada (o refactor shot-repository)
- [ ] Pesos quiz en DB (`quiz_option_weights`) usados por engine
- [ ] Seed quiz questions = mock-data (4 preguntas, 25 opciones)
- [ ] Validación Zod en todos los Server Actions admin
- [ ] Middleware protegiendo `/admin/*` (defense-in-depth)
- [ ] Eliminar fallback hardcodeado WhatsApp en especialista/page.tsx
- [ ] Consolidar chat-bot.tsx / chat-widget.tsx (uno parece dead code)
- [ ] Imágenes productos: estrategia CDN/S3 vs local vs externas

---

## 5. BLOQUEADORES CRÍTICOS
Problemas que impedirían operar ecommerce real **hoy**:

| # | Bloqueador | Archivos involucrados | Impacto |
|---|------------|----------------------|---------|
| 1 | **Stripe sin credenciales** — paymentIntent falla 500 | `.env`, `stripe-payment-provider.ts:18`, `checkout/page.tsx:11` | **Checkout tarjeta inoperativo** |
| 2 | **Stripe constructor sin `apiVersion`** (v17 lo requiere) | `stripe-payment-provider.ts:21` | **Error en build/runtime** si se usan keys reales |
| 3 | **Catálogo 100% mock-data** — repositorios caen en fallback | `product-repository.ts`, `cocktail-repository.ts`, `shot-repository.ts` | **Precios/stock/catálogo no editables por admin** |
| 4 | **Pesos quiz solo en mock-data** — DB `quiz_option_weights` ignorada | `rule-based-recommendation-engine.ts`, `quiz-repository.ts` | **Scoring no administrable** |
| 5 | **Credenciales provider sin password hash** | `auth.ts:17-28` | **Cualquier email en customers entra sin password** |
| 6 | **Rate limiting en memoria** — roto en Vercel serverless | `middleware.ts:11` | **Sin protección DoS real** |
| 7 | **Secretos reales en `.env` commiteado** | `.env` (DATABASE_URL Supabase, service_role, JWT, GEMINI) | **Rotación obligatoria antes de prod** |
| 8 | **Sin usuario admin inicial en DB** | `adminUsers` table, `seed.ts` | **Nadie puede entrar a `/admin`** |

---

## 6. PAGOS
### Proveedor detectado
**Stripe** (PaymentIntents API) — implementado en `src/server/providers/stripe-payment-provider.ts` implementando interfaz `PaymentProvider`.

### Flujo actual
1. Cliente en `/checkout` → `PaymentForm` monta Stripe Elements (client-side)
2. Click "Continuar al pago" → POST `/api/checkout` con `{ items, guestEmail, guestPhone }`
3. **Server `/api/checkout`** (`checkout/route.ts`):
   - Valida items contra DB (precio real, stock, active)
   - Calcula subtotal validado + envío (≥1200 gratis / 150 MXN)
   - Crea `orders` + `order_items` en PostgreSQL
   - Llama `StripePaymentProvider.createPaymentIntent({ orderId, amount: total*100, currency: "mxn", customerEmail })`
   - Guarda `paymentProviderRef` (payment_intent.id) en orden
   - Retorna `{ orderId, clientSecret, subtotal, shipping, total }`
4. Cliente usa `clientSecret` → `stripe.confirmPayment({ return_url: "/checkout/result" })`
5. Stripe redirige a `/checkout/result?payment_intent=pi_xxx`
6. **Webhook** `/api/webhooks/stripe` verifica firma → en `payment_intent.succeeded` actualiza orden a `status: "paid"`

### Causa probable del error "No se pudo iniciar el pago"
1. **`STRIPE_SECRET_KEY` vacía** → `StripePaymentProvider` constructor lanza `Error("STRIPE_SECRET_KEY no está definida.")` → catch 500 → mensaje genérico
2. **Stripe v17 requiere `apiVersion`** en constructor → `new Stripe(process.env.STRIPE_SECRET_KEY)` fallará con keys reales
3. **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` vacía** → `loadStripe("")` → Elements no monta → payment-form.tsx falla silenciosamente

### Archivos involucrados
- `src/server/providers/payment-provider.ts` (interfaz)
- `src/server/providers/stripe-payment-provider.ts` (implementación)
- `src/app/api/checkout/route.ts` (crea orden + paymentIntent)
- `src/app/api/webhooks/stripe/route.ts` (webhook handler)
- `src/app/checkout/page.tsx` (client checkout flow)
- `src/components/checkout/payment-form.tsx` (Stripe Elements mount)
- `src/app/checkout/result/page.tsx` (página resultado)

### Variables necesarias (todas vacías en `.env`)
| Variable | Tipo | Dónde se usa |
|----------|------|--------------|
| `STRIPE_SECRET_KEY` | Server secret | `stripe-payment-provider.ts:18` |
| `STRIPE_WEBHOOK_SECRET` | Server secret | `stripe-payment-provider.ts:41`, webhook route |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client public | `checkout/page.tsx:11` |

### Webhook
- **Implementado**: `src/app/api/webhooks/stripe/route.ts`
- **Verifica firma**: `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)`
- **Maneja**: `payment_intent.succeeded` → `orders.status = "paid"`
- **Falta**: Manejo de `payment_intent.payment_failed`, `charge.refunded`, idempotencia, retries

### Estado de órdenes
- `pending` → (webhook success) → `paid` → (admin) → `shipped` → `delivered` / `cancelled` / `refunded`
- `paymentStatus` field: `unpaid` → `paid` (webhook)
- **Validación server-side precio**: ✅ Sí (`checkout/route.ts:39-50`)
- **Validación server-side stock**: ✅ Sí (`checkout/route.ts:46-48`)
- **Envío incluido correctamente**: ✅ Sí (usa `lib/shipping.ts` single source of truth)
- **Total cliente = total proveedor**: ✅ Sí (amount = `Math.round(total * 100)`)
- **Páginas success/cancel**: Solo `/checkout/result` genérica (lee payment_intent de URL)

### Problemas Vercel específicos
- Webhook URL debe ser `https://soule-k-skin-bar.vercel.app/api/webhooks/stripe`
- `STRIPE_WEBHOOK_SECRET` debe configurarse en Vercel Dashboard
- Stripe CLI `stripe listen --forward-to localhost:3000/api/webhooks/stripe` para dev local

---

## 7. NEON
### Estado actual
- **Drizzle configurado**: `drizzle.config.ts` apunta a `src/lib/db/schema.ts`, output `./drizzle`, dialect `postgresql`
- **Client**: `src/lib/db/client.ts` usa `postgres` driver con pool (max 10, ssl require)
- **DATABASE_URL**: En `.env` usa **Supabase pooler** (puerto 6543); en `.ev` usa **Neon pooler** (distinto host)
- **Migraciones**: 2 archivos en `drizzle/` (`0000_fine_the_fury.sql`, `0001_add_missing_enums.sql`)
- **Seed**: `src/lib/db/seed.ts` — trunca e inserta mockProducts, mockCocktails, 1 quiz question + 4 opciones + weights

### Tablas existentes (29)
Core: `categories`, `products`, `product_images`, `cocktails`, `cocktail_products`, `quiz_questions`, `quiz_options`, `quiz_option_weights`, `quiz_responses`, `recommendation_results`, `customers`, `orders`, `order_items`, `coupons`, `wishlists`, `admin_users`, `analytics_events`

### Qué usa mock-data (fallback en repositorios)
| Repositorio | DB primero | Fallback mock |
|-------------|------------|---------------|
| `product-repository.ts` | `products` + `images` | `mockProducts` (120+) |
| `cocktail-repository.ts` | `cocktails` + `cocktail_products` | `mockCocktails` (9) |
| `shot-repository.ts` | **`cocktails` table** → transforma | `mockShots` (6) |
| `quiz-repository.ts` | `quiz_questions` + options + weights | `fallbackQuizQuestions` (4 q, 25 opts) |

### Qué debe migrarse para Neon = fuente real
1. **Productos**: 120+ de `mockProducts` → `products` + `product_images` (con imágenes reales/CDN)
2. **Cocktails**: 9 de `mockCocktails` → `cocktails` + `cocktail_products` (rutinas AM/PM con stepNumber)
3. **Shots**: Decidir: ¿entidad separada o vista sobre cocktails? Hoy `shot-repository` lee `cocktails` y hardcodea mood/category
4. **Quiz**: 4 preguntas + 25 opciones + **pesos shot/mood** → `quiz_questions`, `quiz_options`, `quiz_option_weights` (requiere rediseño: weights por shot vs por cocktail)
5. **Admin user**: Insert manual en `admin_users` (email + role super_admin)

---

## 8. ADMIN
### Qué existe
| Ruta | Capacidad real |
|------|----------------|
| `/admin` | Dashboard stats (counts productos, clientes, órdenes pagadas, ventas) |
| `/admin/products` | **Create** (name, brand, price, routineStep, stock, shortDescription), **Toggle active**, **Delete** — **sin editar**, sin imágenes, sin skinTypes/concerns/ingredients/benefits/usage/compareAtPrice/categoryId |
| `/admin/cocktails` | **Create only** (name, shortDescription, description) — **sin editar/delete/toggle**, sin asociación productos (dice "usa Drizzle Studio") |
| `/admin/quiz` | **Create question**, **Add option con weight** — **sin editar/delete/reorder** |
| `/admin/orders` | **Read + Update status** (dropdown por fila) — sin crear, sin detalles items expandidos |
| `/admin/customers` | **Read only** + segmentación "inactivos 60 días" |
| `/admin/analytics` | **Read only** funnel (unique sessions por evento) |

### Qué falta (vs especificación)
**Productos**: editar precio, stock, imágenes, descripción completa, skinTypes, concerns, ingredients, benefits, usage (AM/PM/BOTH), compareAtPrice, categoryId, active toggle (existe), isMock flag
**Shots**: CRUD completo, asociar/quitar/ordenar productos, activar/desactivar, definir info Shot
**Cocktails**: CRUD completo, editor visual productos×rutina (AM/PM + orden)
**Quiz**: CRUD preguntas/opciones, editor pesos por shot/cocktail, reordenar
**Pedidos**: Ver items detalle, notas, tracking, reembolsos, crear manual
**Clientes**: Editar, exportar, segmentos avanzados
**Promociones/Cupones**: CRUD (tabla existe, sin UI)
**Inventario**: Movimientos, alertas stock bajo
**Contenido**: Testimonios, FAQs, páginas legales, banners

### Propuesta estructura admin (fases)
- **Fase 1 (MVP Admin)**: Editar producto completo, imágenes, toggle active, asociar productos a cocktails (UI simple), seed admin user
- **Fase 2**: Shots CRUD + asociación productos, Cocktails editor visual rutina
- **Fase 3**: Quiz management completo, Cupones, Pedidos detalle + notas
- **Fase 4**: Clientes segmentación, Promociones, Contenido CMS, Analytics avanzado

---

## 9. SEGURIDAD
### Problemas encontrados y prioridad

| # | Problema | Archivo/Línea | Severidad | Acción |
|---|----------|---------------|-----------|--------|
| 1 | **Credentials provider sin password hash** — acepta cualquier email en `customers` | `auth.ts:17-28` | 🔴 **Crítica** | Agregar bcrypt/argon2 o deshabilitar provider en prod |
| 2 | **Secretos reales en `.env` commiteado** — Supabase URL, service_role, JWT, GEMINI_KEY | `.env` (líneas 3-9, 29) | 🔴 **Crítica** | Rotar **todos** inmediatamente; usar `.env.local` solo local |
| 3 | **Rate limiting en memoria** — `Map` por IP, no funciona en serverless Vercel | `middleware.ts:11` | 🟠 **Alta** | Migrar a Upstash Redis / Vercel Edge Config |
| 4 | **Sin middleware protegiendo `/admin/*`** — solo `requireAdmin()` por página | `middleware.ts` (matcher solo `/api/*`) | 🟠 **Alta** | Agregar matcher `/admin/:path*` + `requireAdmin()` en middleware o edge |
| 5 | **Server Actions sin validación Zod** — FormData strings directo a DB | `actions.ts` (todos) | 🟠 **Alta** | Agregar schemas Zod + `safeParse` |
| 6 | **Fallback WhatsApp hardcodeado** — número real en código | `especialista/page.tsx:6` | 🟡 **Media** | Eliminar fallback; validar env var en build |
| 7 | **Admin user creation solo DB manual** — sin UI | — | 🟡 **Media** | Agregar en seed o setup script |
| 8 | **`NEXT_PUBLIC_` exposure check** — revisado, **ninguna admin logic expuesta** | — | ✅ OK | — |
| 9 | **CSRF en Server Actions** — Next.js lo maneja pero sin tokens explícitos | — | 🟢 **Baja** | Verificar que forms usan `action=` correctamente |
| 10 | **Simulated AI response filtra system prompt** | `soule-ai.ts:61-70` | 🟢 **Baja** | Remover simulation o sanitizar output |
| 11 | **localStorage cart** — manipulable cliente (precios, cantidades) | `cart-context.tsx` | 🟢 **Baja** | Server-side ya valida en checkout; OK |
| 12 | **XSS risk** — `dangerouslySetInnerHTML` no usado; React escapa por defecto | — | ✅ OK | — |
| 13 | **SQL Injection** — Drizzle ORM parameterizado | — | ✅ OK | — |

---

## 10. VERCEL
### Estado deployment
- **Proyecto Vercel**: **No linkado** (no `.vercel/`, no `vercel.json`)
- **GitHub remote**: ✅ `origin` → `https://github.com/gamit0/soule-k-skin-bar.git`
- **Branch producción**: `main` (up-to-date con origin)
- **Pipeline**: GitHub → Vercel → Next.js (estándar, pero **no configurado**)

### Variables de entorno requeridas en Vercel
| Variable | Ambiente | Notas |
|----------|----------|-------|
| `DATABASE_URL` | **Production, Preview, Development** | Neon/Supabase pooler (puerto 6543 o 5432) |
| `AUTH_SECRET` | **Production, Preview, Development** | `openssl rand -base64 33` |
| `AUTH_GOOGLE_ID` | **Production, Preview** | Google Cloud Console OAuth |
| `AUTH_GOOGLE_SECRET` | **Production, Preview** | Google Cloud Console OAuth |
| `GEMINI_API_KEY` | **Production, Preview, Development** | Google AI Studio |
| `NEXT_PUBLIC_SUPABASE_URL` | **Production, Preview, Development** | Client Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Production, Preview, Development** | Client Supabase |
| `STRIPE_SECRET_KEY` | **Production** (Preview opcional) | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | **Production** (Preview opcional) | `stripe listen --forward-to` → copiar signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | **Production, Preview, Development** | Stripe Dashboard |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | **Production, Preview** | Formato `521XXXXXXXXXX` (México) |
| `NEXT_PUBLIC_SITE_URL` | **Production, Preview** | `https://soulekskinbar.com` (para sitemap/robots) |

### Configuración especial Vercel necesaria
- **Build command**: `npm run build` (default)
- **Output directory**: `.next` (default)
- **Install command**: `npm install` (default)
- **Functions**: `middleware.ts` → Edge Runtime (actualmente Node.js; rate limiting no funciona)
- **Cron jobs**: Ninguno configurado (recompra WhatsApp, cleanup, etc.)

---

## 11. GITHUB
### Estado repositorio
```
origin  https://github.com/gamit0/soule-k-skin-bar.git (fetch)
origin  https://github.com/gamit0/soule-k-skin-bar.git (push)

* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
```

- **Branch actual**: `main` (única branch)
- **Cambios sin commit**: 1 archivo untracked (`scripts/fix-product-images.ts`)
- **Commits recientes**: 20 commits, último `8a1f510 fix: resolve duplicate STEP_ICONS...`
- **Riesgo pérdida trabajo**: **Bajo** — main sincronizado con origin, sin commits locales pendientes
- **Force push**: No necesario ni recomendado

---

## 12. QUIZ / RECOMMENDATION ENGINE
### Estado actual
- **Motor**: `RuleBasedRecommendationEngine` (determinístico, rule-based, sin IA)
- **Fuente scoring**: **Solo mock-data** (`quiz-fallback.ts` → `shotWeights`/`moodWeights`)
- **DB weights**: Tabla `quiz_option_weights` existe pero **ignorada por engine**
- **Shots**: 6 definidos en mock-data, cada uno con mood, products, precio total
- **Cocktails**: 9 definidos en mock-data, cada uno con steps (LIMPIA/PREPARA/TRATA/PROTEGE) + products
- **Mapeo Shot→Cocktail**: Explícito en `shot-cocktail-map.ts` (6 entradas + fallback por mood)
- **Match Score**: Fórmula `Math.min(99, Math.max(88, 85 + (topShotScore/totalWeight)*14))` → **clamp artificial 88-99**
- **Shot secundario**: Threshold 55% del score primario (hardcoded)
- **Rutinas AM/PM**: Cocktail base steps + Shot products insertados en posición 1
- **IA (Gemini)**: Solo en `soule-ai.ts` para chat asistente; **NO participa en quiz scoring** (por diseño)

### Deuda técnica
1. **Arquitectura dual**: Mock-data (shotWeights) vs DB (cocktailWeights) — reconciliar
2. **Shots no entidad DB** — `shot-repository` consulta `cocktails` y hardcodea mood/category
3. **Seed ≠ Mock** — seed crea 1 pregunta simple; mock tiene 4 preguntas complejas
4. **Match Score no es % real** — clamp 88-99 engaña al usuario
5. **Resultado quiz en sessionStorage** — frágil; sin retrieval server-side por ID

### Arquitectura recomendada para producción
- **Fuente única de verdad**: PostgreSQL para preguntas, opciones, **pesos por shot**
- **Entidad Shot separada** o vista materializada con mood/category propios
- **Engine lee pesos de DB** → elimina dependencia mock-data
- **Match Score real**: `(topScore / maxPossibleScore) * 100` sin clamp
- **Persistencia resultado**: `recommendationResults` ya existe; usar `recommendationId` para retrieval

---

## 13. CHECKOUT
### Estado actual
- **Carrito**: `CartContext` + localStorage (client-side only)
- **Subtotal**: `items.reduce(sum + price * qty)` — precios de mock-data/DB al agregar
- **Envío**: `lib/shipping.ts` — **single source of truth** ✅ (`FREE_SHIPPING_THRESHOLD=1200`, `SHIPPING_COST=150`)
- **Total**: `calcTotal(subtotal)` = subtotal + shipping
- **Stock**: Verificado en `/api/products/stock` (POST) → DB + fallback mock
- **Checkout API** (`/api/checkout`):
  - ✅ Valida precio server-side contra DB
  - ✅ Valida stock server-side contra DB
  - ✅ Recalcula subtotal + envío server-side
  - ✅ Crea orden + items con precios DB
  - ✅ Crea Stripe PaymentIntent con amount = total * 100
  - ❌ **No valida cupón** (tabla existe, sin lógica)
  - ❌ **No maneja dirección envío** (guestEmail/phone only)
- **Frontend checkout** (`checkout/page.tsx`):
  - Email + WhatsApp inputs
  - Muestra subtotal (SIN envío) → **BUG: no muestra total con envío**
  - Stripe Elements mount condicional a `clientSecret`
- **Resultado** (`checkout/result/page.tsx`): Lee `payment_intent` de URL, consulta orden por `paymentProviderRef`, muestra éxito/error

### Problemas detectados
1. **Checkout page muestra solo subtotal** (línea 79: `${subtotal} MXN`) — **no incluye envío** → confusión usuario
2. **Sin dirección de envío** — orden no captura dirección; solo email/phone
3. **Sin cupón/código descuento** — tabla `coupons` existe, sin integración
4. **Payment-form.tsx**: `loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")` — si key vacía, Elements no monta

---

## 14. PLAN DE IMPLEMENTACIÓN

### FASE A — Corregir pagos
**Objetivo**: Checkout Stripe 100% funcional en producción
- **Archivos afectados**: `.env`, `stripe-payment-provider.ts`, `checkout/page.tsx`, `payment-form.tsx`, `api/webhooks/stripe/route.ts`, `checkout/result/page.tsx`
- **Dependencias**: Cuenta Stripe activada, webhook URL registrada
- **Riesgos**: Stripe v17 `apiVersion` requerido; webhook idempotencia; testing con tarjetas test
- **Criterios aceptación**:
  - [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` en Vercel Production
  - [ ] `Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })` (o versión actual)
  - [ ] PaymentElement renderiza en `/checkout` con tarjeta test 4242 4242 4242 4242
  - [ ] Webhook recibe `payment_intent.succeeded` → orden `paid` en Neon
  - [ ] `/checkout/result` muestra éxito con order ID
  - [ ] Envío calculado correctamente en total mostrado al usuario

### FASE B — Conectar Neon
**Objetivo**: Neon PostgreSQL como fuente de verdad única (sin mock fallbacks en producción)
- **Archivos afectados**: `.env` (DATABASE_URL Neon), `drizzle.config.ts`, `db/client.ts`, `seed.ts`, todos los repositorios
- **Dependencias**: Cuenta Neon, DB creada, migraciones aplicadas
- **Riesgos**: Migración datos mock → real; conexiones pooler Vercel serverless; SSL config
- **Criterios aceptación**:
  - [ ] `DATABASE_URL` apunta a Neon (pooler) en Vercel Production/Preview
  - [ ] `npm run db:migrate` aplica sin errores en Neon
  - [ ] `npm run db:seed` puebla catálogo real (productos, cocktails, quiz)
  - [ ] Repositorios **no caen en fallback mock** (logs sin "falling back to mock")
  - [ ] Build Vercel exitoso con DB conectada

### FASE C — Migrar catálogo/Shot/Quiz a Neon
**Objetivo**: Datos reales administrables desde Admin
- **Archivos afectados**: `seed.ts`, `mock-data/*` (referencia), `shot-repository.ts`, `rule-based-recommendation-engine.ts`, `quiz-repository.ts`, admin actions
- **Dependencias**: Fase B completada; decisión arquitectura Shots (entidad vs vista)
- **Riesgos**: Reconciliar shotWeights (mock) vs cocktailWeights (DB); imágenes productos (CDN vs local)
- **Criterios aceptación**:
  - [ ] 120+ productos en Neon con precios, stock, imágenes, skinTypes, concerns, ingredients, benefits
  - [ ] 9 Cocktails con rutinas AM/PM (stepNumber, usage) en `cocktail_products`
  - [ ] 6 Shots como entidad propia o vista con mood/category correctos
  - [ ] 4 Quiz questions + 25 opciones + pesos en `quiz_option_weights` (por shot)
  - [ ] Engine usa pesos DB (eliminar dependencia `fallbackQuizQuestions`)
  - [ ] Admin puede editar todo lo anterior

### FASE D — Crear Admin completo
**Objetivo**: No-técnico puede gestionar catálogo, pedidos, quiz, clientes
- **Archivos afectados**: `admin/products/*`, `admin/cocktails/*`, `admin/shots/*` (nuevo), `admin/quiz/*`, `admin/orders/*`, `admin/customers/*`, `require-admin.ts`, `middleware.ts`
- **Dependencias**: Fase C (datos reales), usuario admin seed
- **Riesgos**: Complejidad UI asociaciones; validación Zod; permisos por rol
- **Criterios aceptación**:
  - [ ] `/admin/products`: CRUD completo (incl. imágenes, todos los campos)
  - [ ] `/admin/shots`: CRUD + asociar/quitar/ordenar productos
  - [ ] `/admin/cocktails`: CRUD + editor visual rutina AM/PM
  - [ ] `/admin/quiz`: CRUD preguntas/opciones + editor pesos por shot
  - [ ] `/admin/orders`: Ver items, notas, tracking, reembolso
  - [ ] `/admin/customers`: Editar, exportar CSV, segmentos
  - [ ] Middleware protege `/admin/*` (defense-in-depth)
  - [ ] Zod validation en todos los Server Actions

### FASE E — Conectar MaviBot al catálogo real
**Objetivo**: MaviBot puede recomendar productos reales del catálogo
- **Archivos afectados**: `external-chatbot.tsx`, `soule-ai.ts`, `product-repository.ts`, MaviBot dashboard (externo)
- **Dependencias**: Fase C (catálogo real), acceso MaviBot admin
- **Riesgos**: MaviBot es SaaS externo; integración limitada a lo que permita su API
- **Criterios aceptación**:
  - [ ] MaviBot configurado con knowledge base de productos Soule K
  - [ ] `soule-ai.ts` (Gemini) grounded en catálogo Neon real
  - [ ] ChatBot widget consulta productos/precios/stock reales

### FASE F — Seguridad y QA
**Objetivo**: Postura de seguridad producción + testing automatizado
- **Archivos afectados**: `auth.ts`, `middleware.ts`, `actions.ts` (todos), `.env` rotation, `package.json` (scripts), GitHub Actions
- **Dependencias**: Fases A-E
- **Riesgos**: Rotación secretos rompe dev temporalmente; CI/CD flakiness inicial
- **Criterios aceptación**:
  - [ ] Credenciales provider con bcrypt/argon2 o deshabilitado
  - [ ] Rate limiting Upstash Redis en `/api/*` y `/admin/*`
  - [ ] Middleware protege `/admin/*` + security headers
  - [ ] Zod validation en todos Server Actions
  - [ ] `.env` secretos rotados; `.ev` eliminado; `.gitignore` verificado
  - [ ] GitHub Actions: `typecheck` + `lint` + `build` + `db:migrate` (preview)
  - [ ] Tests: unit (engine scoring), integration (checkout, quiz), e2e (happy path)

### FASE G — Dominio personalizado
**Objetivo**: `soulekskinbar.com` (o dominio elegido) activo con SSL
- **Archivos afectados**: Vercel Domains, DNS provider, `robots.ts`, `sitemap.ts`, `layout.tsx` metadata
- **Dependencias**: Fase F, dominio comprado
- **Riesgos**: Propagación DNS; certificado SSL; cookies cross-domain
- **Criterios aceptación**:
  - [ ] Dominio agregado en Vercel + DNS configurado (A + CNAME)
  - [ ] SSL automático Vercel activo
  - [ ] `NEXT_PUBLIC_SITE_URL` = dominio real
  - [ ] `robots.ts` + `sitemap.ts` generan URLs correctas
  - [ ] Cookies `SameSite=Lax` + `Secure` en producción

### FASE H — Launch
**Objetivo**: Go-live controlado + monitoreo
- **Archivos afectados**: Vercel deployment, monitoring (Vercel Analytics, Sentry opcional), runbooks
- **Dependencias**: Fases A-G completadas y validadas en Preview
- **Riesgos**: Tráfico real expone edge cases; rollback plan
- **Criterios aceptación**:
  - [ ] Deploy Production desde main → Vercel
  - [ ] Smoke test: Quiz → Shot → Cart → Checkout Stripe → Orden paid → WhatsApp confirm
  - [ ] Monitoreo: Vercel Analytics + Logs + Error tracking
  - [ ] Runbook: rollback, webhook failure, Stripe dispute, stock out
  - [ ] Comunicación launch a stakeholders

---

## 15. RECOMENDACIÓN TÉCNICA

### ¿Qué hacer primero y por qué?

**ORDEN DE PRIORIDAD ABSOLUTO:**

1. **🔴 ROTAR SECRETOS YA** (30 min)
   - `.env` tiene credenciales Supabase reales commiteadas (DATABASE_URL, service_role, JWT, GEMINI)
   - Generar nuevas en Supabase/Neon/Google AI; actualizar `.env.local` local; configurar en Vercel
   - **Por qué**: Riesgo seguridad inmediato; bloquea cualquier deploy seguro

2. **🔴 STRIPE: Credenciales + apiVersion + Elements** (2-4 hrs)
   - Sin esto, **no hay pagos con tarjeta** — bloqueador #1 de revenue
   - Fix: `new Stripe(key, { apiVersion: "2024-06-20" })` + vars en Vercel + webhook configurado
   - **Por qué**: Blocker crítico de negocio; el resto del checkout ya está bien implementado

3. **🟠 NEON: DATABASE_URL + Migraciones + Seed real** (2-3 hrs)
   - Cambiar `.env` a Neon pooler; `db:migrate` + `db:seed` con datos reales
   - Eliminar fallbacks mock en repositorios (o hacer que fallen explícitamente si DB down)
   - **Por qué**: Fuente de verdad única; admin no puede editar mock-data

4. **🟠 ADMIN: Seed admin user + Editar producto completo + Zod validation** (4-6 hrs)
   - Insert en `admin_users` (email + super_admin); `createProduct` → `updateProduct` con todos campos
   - Zod schemas en todos actions; middleware `/admin/*` protection
   - **Por qué**: Permite gestionar catálogo real sin tocar DB manualmente

5. **🟠 QUIZ/ENGINE: Pesos en DB + Shots entidad real** (3-5 hrs)
   - Rediseñar `quiz_option_weights` para pesos por shot (no por cocktail)
   - Migrar 4 preguntas + 25 opciones + weights a Neon
   - Engine lee de DB; eliminar `fallbackQuizQuestions` import
   - Shot-repository: entidad propia o vista con mood/category correctos
   - **Por qué**: Scoring administrable; consistencia arquitectura

6. **🟡 WHATSAPP: Decidir wa.me vs Business API + limpiar fallback** (1-2 hrs)
   - Si wa.me manual OK: documentar, quitar hardcode `especialista/page.tsx`
   - Si Business API: integrar Twilio/Meta + implementar `NotificationProvider.send()`
   - **Por qué**: UX consistente; evitar número hardcodeado en producción

7. **🟡 CI/CD + LINT + TYPECHECK + VERCEL CONFIG** (2-3 hrs)
   - `eslint.config.mjs` + `npm run lint` + `npm run typecheck` passing
   - GitHub Actions workflow (typecheck, lint, build, db:migrate preview)
   - `vercel.json` + proyecto linkado + env vars por ambiente
   - **Por qué**: Calidad automática; previene regresiones; deploy confiable

8. **🟢 RESTO**: Imágenes CDN, sitemap dinámico, og-image, MaviBot knowledge base, QA manual, runbooks, launch

---

### Principios guía para la implementación
1. **Seguridad primero** — rotar secretos, validar inputs, proteger admin
2. **Integridad de datos** — Neon = única fuente; mock-data solo referencia/seed
3. **Pagos antes que features** — sin checkout, no hay negocio
4. **Admin habilita escalabilidad** — no-técnico gestiona catálogo sin dev
5. **Determinismo auditable** — quiz scoring en DB, versionado, trazable
6. **Experiencia usuario** — total con envío visible, errores claros, fallback WhatsApp fluido
7. **No sacrificar estabilidad por velocidad** — cada fase con criterios de aceptación claros y testing

---

**Fin del reporte de auditoría.**  
**Próximo paso**: Esperar autorización para comenzar **FASE A — Corregir pagos**.