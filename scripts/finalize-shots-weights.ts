import "dotenv/config";
import { db } from "../src/lib/db/client";
import { sql } from "drizzle-orm";

async function main() {
  // First, clean up any rows with NULL shot_id
  await db.execute(sql`
    DELETE FROM "quiz_option_weights" WHERE "shot_id" IS NULL;
  `);
  console.log('Cleaned up rows with NULL shot_id');

  // Make shot_id NOT NULL
  await db.execute(sql`
    ALTER TABLE "quiz_option_weights" ALTER COLUMN "shot_id" SET NOT NULL;
  `);
  console.log('Made shot_id NOT NULL');

  // Add primary key constraint (option_id, shot_id)
  await db.execute(sql`
    ALTER TABLE "quiz_option_weights" DROP CONSTRAINT IF EXISTS "quiz_option_weights_pkey";
  `);
  await db.execute(sql`
    ALTER TABLE "quiz_option_weights" ADD PRIMARY KEY ("option_id", "shot_id");
  `);
  console.log('Added primary key constraint');

  console.log('Step 2 complete. quiz_option_weights finalized.');
  process.exit(0);
}

main().catch(console.error);