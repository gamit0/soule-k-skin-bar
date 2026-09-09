# 🍸 Soule K Skin Bar

Plataforma e-commerce de skincare personalizado.

## Organización del repo (decisión)

Uso un **repositorio dedicado** (`soule-k-skin-bar`) en vez de meter esto
dentro de `gamit0-site`. Razón: este proyecto va a tener su propia base de
datos, sus propias variables de entorno, su propio proyecto en Vercel y su
propia integración de Stripe — mezclarlo con un repo de portafolio/sitio
personal complica CI/CD y despliegues sin ninguna ventaja real.

El **project board** que compartiste
(`github.com/users/gamit0/projects/1`) es a nivel de usuario, no de repo,
así que puede seguir usándose para trackear el trabajo de este proyecto
sin importar en qué repositorio viva el código — solo hay que vincular los
issues de `soule-k-skin-bar` a ese board.

**Para dejarlo listo:**
```
gh repo create gamit0/soule-k-skin-bar --public --source=. --remote=origin
git add .
git commit -m "Fase 1-2: foundation + landing page"
git push -u origin main
```
(o el flujo equivalente en la web de GitHub, si prefieres no usar `gh`).

## Estado del roadmap

Las 13 fases están escritas. **Antes de correrlo en producción, lee
`DOC-PENDIENTES.md`** — ahí está todo lo que falta de tu lado (cuentas,
credenciales, contenido real, QA).

- ✅ Fase 1 — Foundation
- ✅ Fase 2 — Landing Page
- ✅ Fase 3 — Products (catálogo, PDP, JSON-LD)
- ✅ Fase 4 — Skin Quiz
- ✅ Fase 5 — Recommendation Engine (scoring por reglas)
- ✅ Fase 6 — Cart / Checkout (falta montar Stripe Elements, ver DOC-PENDIENTES.md)
- ✅ Fase 7 — Authentication (Google OAuth; credentials provider es placeholder)
- ✅ Fase 8 — Admin (productos, cocktails, quiz, pedidos, clientes)
- ✅ Fase 9 — CRM (segmentación básica de clientes inactivos)
- ✅ Fase 10 — WhatsApp (deep link)
- ✅ Fase 11 — AI / Soule AI (requiere `ANTHROPIC_API_KEY`)
- ✅ Fase 12 — Analytics (eventos + funnel en `/admin/analytics`)
- ✅ Fase 13 — Production hardening (rate limiting, headers, sitemap, robots.txt, SEO)

## Decisiones técnicas (Fase 1)

- **ORM: Drizzle** — más ligero, mejor control SQL para el motor de
  scoring del quiz, mejor comportamiento en serverless/Vercel.
- **Checkout: invitado + cuenta.** El schema ya soporta ambos.
- **Tailwind v4** vía `@theme` en `globals.css`, sin `tailwind.config.js`.

## Diseño (Fase 2)

Paleta: `ivory` (fondo), `plum-ink` (texto), `wine`/`wine-dark` (acento
primario — CTAs), `blush` (acento suave, fondos de bloque), `gold`
(detalle mínimo). Tipografía: **Fraunces** (display, headlines) +
**Inter** (cuerpo), cargadas vía `next/font/google` en `layout.tsx`.

El menú de cocktails se diseñó como lista tipo "carta", no como grid de
tarjetas con sombra — es el único guiño visual al concepto "bar", sin caer
en estética de bar de alcohol. La sección "Cómo funciona" es la única con
numeración, porque es la única sección que realmente es una secuencia.

## Estructura

```
src/
  app/                → rutas (App Router)
  components/
    marketing/          → secciones de la landing (Fase 2)
    ui/                  → primitivos reutilizables (Fase 3+)
  lib/db/               → cliente y schema de Drizzle
  server/
    services/            → lógica de negocio
    repositories/         → acceso a datos (Fase 3+)
    providers/             → interfaces desacopladas: pagos, notificaciones
  types/                → tipos compartidos
  mock-data/             → cocktails y productos de prueba, marcados isMock
```

## Setup local

1. `cp .env.example .env` y completa `DATABASE_URL`.
2. `npm install`
3. `npm run db:generate && npm run db:migrate`
4. `npm run dev` — `http://localhost:3000`

## Verificación antes de avanzar de fase

```
npm run typecheck
npm run lint
npm run build
```

## Próxima fase

**Fase 3 — Products**: modelo de datos ya existe en `schema.ts`; falta
catálogo navegable, página de producto individual (PDP), categorías, y
migrar de mock-data a datos reales desde Postgres.
