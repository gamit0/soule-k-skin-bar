import "dotenv/config";
import { db } from "../src/lib/db/client";
import { sql } from "drizzle-orm";

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "shots" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "slug" varchar(160) NOT NULL UNIQUE,
      "name" varchar(160) NOT NULL,
      "menu_title" varchar(160),
      "subtitle" varchar(280),
      "category" varchar(120),
      "description" text,
      "icon" varchar(60),
      "mood" varchar(20) NOT NULL,
      "concerns" "concern"[] DEFAULT '{}' NOT NULL,
      "skin_types" "skin_type"[] DEFAULT '{}' NOT NULL,
      "active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log('shots created');

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "shot_products" (
      "shot_id" uuid NOT NULL REFERENCES "shots"("id") ON DELETE CASCADE,
      "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "order" integer DEFAULT 0 NOT NULL,
      PRIMARY KEY ("shot_id", "product_id")
    );
  `);
  console.log('shot_products created');

  await db.execute(sql`
    ALTER TABLE "quiz_option_weights" DROP COLUMN IF EXISTS "cocktail_id";
  `);
  console.log('dropped cocktail_id');

  await db.execute(sql`
    ALTER TABLE "quiz_option_weights" ADD COLUMN IF NOT EXISTS "shot_id" uuid REFERENCES "shots"("id") ON DELETE CASCADE;
  `);
  console.log('added shot_id (nullable)');

  // Don't add PK constraint yet - will do after seed populates data
  // Seed will populate quiz_option_weights with valid shot_ids
  // Then we run a second step to make shot_id NOT NULL and add PK

  console.log('Step 1 complete. Now run: npx tsx src/lib/db/seed.ts');
  console.log('Then run: npx tsx scripts/finalize-shots-weights.ts');

  process.exit(0);
}

main().catch(console.error);