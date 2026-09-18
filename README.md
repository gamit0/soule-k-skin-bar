# Soule K Skin Bar

E-commerce platform for personalized skincare. Architecture based on a deterministic scoring engine for skin diagnosis (Cocktails).

## 🚀 Quick Start (Local)

1.  **Instalación**:
    ```bash
    npm install
    ```
2.  **Configuración**:
    Copia el archivo `.env.example` a `.env` y rellena las variables.
3.  **Base de Datos**:
    Aplica las migraciones y carga los datos mock:
    ```bash
    npm run db:migrate
    npm run db:seed
    ```
4.  **Ejecución**:
    ```bash
    npm run dev
    ```

## 🌐 Despliegue en Producción (Sitio)

Para que el sitio funcione en producción (Vercel, Netlify, etc.), sigue estos pasos:

### 1. Variables de Entorno
Configura las siguientes variables en el panel de control de tu hosting:
- `DATABASE_URL`: Tu connection string de Supabase (usa el pooler puerto 6543).
- `GEMINI_API_KEY`: Tu llave de Google Gemini AI.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Credenciales de Supabase.
- `AUTH_SECRET`: Un string aleatorio largo para Auth.js.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Número de contacto con código de país.

### 2. Base de Datos
Asegúrate de aplicar las migraciones a tu base de datos de producción. Puedes hacerlo ejecutando `npm run db:migrate` desde un entorno que tenga acceso a la DB de producción o configurando un script de post-instalación.

### 3. Build
El comando de construcción estándar es `npm run build`.

## 🛠 Stack Técnico
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **ORM**: Drizzle ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **AI**: Google Gemini 1.5 Flash
