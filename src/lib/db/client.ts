import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida. Revisa tu .env");
}

const client = postgres(process.env.DATABASE_URL, {
  max: 10,
  ssl: 'require'
});

export const db = drizzle(client, { schema });
