import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Durante el build de Next.js, es posible que DATABASE_URL no esté presente.
// Solo lanzamos el error si estamos en runtime (no en fase de build)
// o si intentamos inicializar el cliente sin la URL.
if (!connectionString && process.env.NODE_ENV !== 'production') {
  console.warn("⚠️ DATABASE_URL no está definida. El acceso a la base de datos fallará en runtime.");
}

const client = postgres(connectionString || "", {
  max: 10,
  ssl: 'require'
});

export const db = drizzle(client, { schema });

