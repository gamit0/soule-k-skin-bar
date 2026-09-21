import 'dotenv/config';
import { db } from './src/lib/db/client';
import { customers, adminUsers } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function check() {
  const emails = ['gamalielpec@gmail.com', 'admin@soulekskinbar.com'];

  console.log('Checking customers:');
  for (const email of emails) {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, email)
    });
    console.log(`  ${email}:`, customer ? `EXISTS (id: ${customer.id})` : 'NOT FOUND');
  }

  console.log('\nChecking admin users:');
  for (const email of emails) {
    const admin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, email)
    });
    console.log(`  ${email}:`, admin ? `EXISTS (id: ${admin.id}, role: ${admin.role})` : 'NOT FOUND');
  }
}

check().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
