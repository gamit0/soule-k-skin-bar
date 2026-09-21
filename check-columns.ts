import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function check() {
  const result = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='customers'
    AND column_name IN ('role', 'password_hash')
  `;
  console.log('Customers columns:', result);

  const adminResult = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='admin_users'
    AND column_name = 'password_hash'
  `;
  console.log('Admin columns:', adminResult);

  await sql.end();
}

check().catch(console.error);
