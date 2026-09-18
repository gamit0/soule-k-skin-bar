# Soule K Skin Bar

E-commerce platform for personalized skincare. Architecture based on a deterministic scoring engine for skin diagnosis (Cocktails).

## Stack
- Next.js
- TypeScript
- Tailwind
- Drizzle
- PostgreSQL

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Variables de entorno

El proyecto requiere las siguientes variables de entorno definidas en un archivo `.env`:

- `DATABASE_URL`: URL de conexión a PostgreSQL.
- `AUTH_SECRET`: Secreto para Auth.js (generar con `openssl rand -base64 33`).
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Credenciales de Google OAuth.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Credenciales de Stripe.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Número de WhatsApp para contacto.
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`: Configuración de almacenamiento S3.
- `ANTHROPIC_API_KEY`: Llave API de Anthropic para Soule AI.

## Build

```bash
npm run build
```

## Estado actual

Este repositorio representa la versión MVP actual del proyecto.
