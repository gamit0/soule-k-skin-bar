import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function apply() {
  console.log('Applying migrations manually...');

  // Check if columns exist
  const columns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='customers'
    AND column_name IN ('role', 'password_hash')
  `;

  if (columns.length === 0) {
    console.log('Adding columns to customers...');
    await sql`ALTER TABLE customers ADD COLUMN role varchar(20) NOT NULL DEFAULT 'customer'`;
    await sql`ALTER TABLE customers ADD COLUMN password_hash varchar(191) NOT NULL DEFAULT ''`;
    console.log('✓ Added columns to customers');
  } else {
    console.log('Columns already exist in customers');
  }

  const adminCols = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='admin_users'
    AND column_name = 'password_hash'
  `;

  if (adminCols.length === 0) {
    console.log('Adding password_hash to admin_users...');
    await sql`ALTER TABLE admin_users ADD COLUMN password_hash varchar(191)`;
    console.log('✓ Added password_hash to admin_users');
  } else {
    console.log('password_hash already exists in admin_users');
  }

  await sql.end();
  console.log('Done!');
}

apply().catch(console.error);
