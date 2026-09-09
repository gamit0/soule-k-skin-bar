# 📋 DOC-PENDIENTES — Soule K Skin Bar

Todo el código de las 13 fases está escrito y organizado en el repo. Esto
es lo que **queda de tu lado** antes de que funcione en producción — nada
de esto lo puedo hacer yo porque requiere cuentas, credenciales o
decisiones que solo tú puedes tomar.

---

## 1. Subir el código a GitHub

No tengo acceso a red/git en el entorno donde generé esto. Desde tu
máquina:

```
cd soule-k-skin-bar
gh repo create gamit0/soule-k-skin-bar --public --source=. --remote=origin
git add .
git commit -m "Fases 1-13: MVP completo"
git push -u origin main
```

(o crea el repo desde la web de GitHub y sigue las instrucciones de
`git remote add origin ...` que te da).

Recuerda vincular los issues/tareas de este repo al project board que ya
tenías: `github.com/users/gamit0/projects/1`.

---

## 2. Cuentas y credenciales que necesitas crear

Nada de esto lo puedo generar yo — son cuentas tuyas.

| Servicio | Para qué | Dónde configurarlo |
|---|---|---|
| **PostgreSQL** (Neon, Supabase o Railway) | Base de datos real | `DATABASE_URL` en `.env` y en Vercel |
| **Vercel** | Deploy | Conectar el repo de GitHub |
| **Stripe** | Cobros | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Google Cloud (OAuth)** | Login con Google | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |
| **Número de WhatsApp Business** | Botón "hablar con especialista" | `NEXT_PUBLIC_WHATSAPP_NUMBER` (con código de país, sin `+` ni espacios) |
| **Anthropic API key** | Soule AI (Fase 11) | `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com) |
| **Storage S3-compatible** (Cloudflare R2, AWS S3, Supabase Storage) | Imágenes de producto | `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` |
| **Dominio** | `soulekskinbar.com` o el que elijas | DNS apuntando a Vercel + `NEXT_PUBLIC_SITE_URL` |

Todas las variables ya están listadas con su nombre exacto en `.env.example`.

---

## 3. Cosas que quedaron explícitamente marcadas como pendientes en el código

Busca `DOC-PENDIENTES.md` en comentarios del código — son los puntos donde
tomé una decisión de MVP a propósito en vez de sobre-construir:

- **Checkout — Stripe Elements sin montar** (`src/app/checkout/page.tsx`):
  la orden y el `clientSecret` ya se generan correctamente, pero falta
  instalar `@stripe/react-stripe-js` y montar `<Elements>` +
  `<PaymentElement>` con tu publishable key real para capturar la
  tarjeta. Es la única pieza de UI de pago que no pude completar sin una
  cuenta de Stripe real.
- **Editor visual de rutinas de cocktail y pesos del quiz**: por ahora,
  asociar productos a la rutina AM/PM de un cocktail (tabla
  `cocktail_products`) y asignar pesos de scoring a las opciones del quiz
  (tabla `quiz_option_weights`) se hace con `npm run db:studio` (Drizzle
  Studio, es una UI de admin de base de datos que viene gratis con
  Drizzle). Construir un editor visual dentro del admin panel es trabajo
  de una fase futura, no crítico para lanzar.
- **Login con credenciales (email/password)**: el provider de
  `Credentials` en `src/lib/auth.ts` está de placeholder — busca al
  cliente por email pero NO valida contraseña con hash. Antes de
  habilitarlo en producción hay que decidir estrategia de password
  storage (bcrypt/argon2) o quitar ese provider y dejar solo Google.
- **Rate limiting en memoria** (`middleware.ts`): funciona para un solo
  servidor. Si despliegas en Vercel con tráfico real (múltiples
  instancias serverless), cada instancia tiene su propio contador — para
  rate limiting robusto hay que mover esto a Upstash Redis (tiene tier
  gratuito y se integra fácil con Vercel).
- **Primer admin user**: la tabla `admin_users` empieza vacía. Nadie va a
  poder entrar a `/admin` hasta que insertes tu propio email ahí
  manualmente (vía Drizzle Studio o una migración) con rol `super_admin`.
- **WhatsApp**: hoy es un deep link (`wa.me`), no la API oficial. Es
  intencional para el MVP — automatizar recordatorios de recompra (Fase
  10 avanzada) requiere WhatsApp Business API (Meta Cloud API o un
  proveedor como Twilio/360dialog), que es una integración más grande.

---

## 4. Datos y contenido real

- **Productos reales**: hoy el catálogo está vacío en la DB real — el
  seed (`npm run db:seed`) solo carga los 4 productos mock, marcados
  `isMock: true`, para poder probar el flujo. Cárgalos de verdad desde
  `/admin/products` o directo en la DB.
- **Imágenes de producto**: el schema tiene `product_images` listo pero
  no hay upload de imágenes construido — necesitas conectar tu bucket S3
  y, o bien subir URLs manualmente, o pedirme que construya el uploader
  cuando tengas el bucket configurado.
- **Testimonios**: la sección está con estado vacío a propósito — no
  inventé ninguno. Cuando tengas testimonios reales de clientas, se
  cargan en `src/components/marketing/testimonials.tsx` (o se mueven a
  la DB si prefieres gestionarlos desde el admin).
- **Instagram feed real**: hoy es un placeholder visual. Conectar el feed
  real requiere la Instagram Graph API (cuenta de negocio de Instagram +
  Facebook Developer App).
- **Textos legales**: aviso de privacidad, términos y condiciones, y
  política de cookies (México) — no los redacté porque son contenido
  legal que normalmente revisa un abogado; puedo ayudarte a armar un
  primer borrador si me dices qué datos personales vas a recolectar
  exactamente.

---

## 5. Verificación técnica antes de cada deploy

No tengo acceso a `npm install` en el entorno donde escribí este código,
así que **no pude correr build/lint/typecheck** sobre el resultado final.
Antes de hacer deploy, corre esto localmente y corrige lo que salga:

```
npm install
npm run typecheck
npm run lint
npm run build
```

Es esperable que aparezcan uno o dos ajustes menores de tipos — el código
está escrito con cuidado pero sin haber pasado por un compilador real en
este entorno.

---

## 6. Probar el flujo completo (QA manual)

1. `npm run db:seed` para tener cocktails/productos/pregunta de prueba.
2. Inserta tu email en `admin_users` con rol `super_admin`.
3. Entra a `/admin`, revisa el dashboard, crea un producto real.
4. Haz el Skin Quiz completo en `/quiz` y confirma que llega a un
   resultado de cocktail coherente.
5. Agrega el cocktail al carrito, ve a `/checkout`, confirma que se crea
   la orden (aunque el pago no se pueda completar hasta montar Stripe
   Elements — punto 3).
6. Prueba el webhook de Stripe con el Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) usando el modo test.
7. Prueba "Hablar con una especialista" y confirma que abre WhatsApp con
   el mensaje precargado correcto.
8. Revisa `/admin/analytics` después de un par de recorridos de prueba —
   deberías ver los contadores del funnel subir.

---

## 7. Seguridad antes de lanzar a producción real

- Rota cualquier secret que hayas usado en pruebas antes del lanzamiento
  real (Stripe test keys → live keys, etc.).
- Revisa que `.env` nunca se haya commiteado (ya está en `.gitignore`,
  pero vale la pena confirmarlo con `git log --all -- .env`).
- Define un proceso de backup de la base de datos (la mayoría de
  proveedores de Postgres managed —Neon, Supabase— lo traen incluido,
  pero confirma la retención).
- Considera agregar un WAF/CDN básico si vas a recibir tráfico alto desde
  campañas pagadas de Instagram/TikTok (Vercel ya da algo de esto por
  default).

---

## 8. Roadmap más allá del MVP (cuando quieras seguir)

Esto no es urgente para lanzar, pero quedó como próximos pasos naturales:

- Editor visual de cocktails/quiz dentro del admin (reemplaza Drizzle
  Studio).
- WhatsApp Business API real con recordatorios automáticos de recompra.
- Uploader de imágenes conectado al bucket S3.
- Tests automatizados (Vitest para lógica de scoring, Playwright para
  flujos end-to-end del quiz y checkout).
- Panel de reportes más robusto en `/admin/analytics` (gráficas, filtros
  por fecha).
- CI en GitHub Actions que corra `typecheck`/`lint`/`build` en cada PR.

---

Si quieres, en la próxima sesión puedo ayudarte a resolver cualquiera de
estos puntos uno por uno en cuanto tengas las cuentas/credenciales
correspondientes.
