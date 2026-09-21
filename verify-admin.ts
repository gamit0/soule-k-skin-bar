import 'dotenv/config';
import { db } from './src/lib/db/client';
import { customers, adminUsers } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function verify() {
  const email = 'gamalielpec@gmail.com';
  const password = 'admin123';

  console.log(`Verifying admin login for ${email}...`);

  const customer = await db.query.customers.findFirst({
    where: eq(customers.email, email)
  });

  console.log('Customer:', customer ? 'Found' : 'Not found');
  if (customer) {
    console.log('  ID:', customer.id);
    console.log('  Role:', customer.role);
    console.log('  Has password:', !!customer.password_hash);
    if (customer.password_hash) {
      const valid = await bcrypt.compare(password, customer.password_hash);
      console.log('  Password valid:', valid);
    }
  }

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email)
  });

  console.log('Admin user:', admin ? 'Found' : 'Not found');
  if (admin) {
    console.log('  ID:', admin.id);
    console.log('  Role:', admin.role);
    console.log('  Has password:', !!admin.password_hash);
    if (admin.password_hash) {
      const valid = await bcrypt.compare(password, admin.password_hash);
      console.log('  Password valid:', valid);
    }
  }

  console.log('\n✅ Admin setup complete!');
  console.log('You can now login at /admin/login');
}

verify().catch(console.error);
