import 'dotenv/config';
import { db } from './src/lib/db/client';
import { customers, adminUsers } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const adminEmail = 'gamalielpec@gmail.com';
  const password = 'admin123'; // Change this!

  console.log(`Creating admin for ${adminEmail}...`);

  // Check if customer exists
  let customer = await db.query.customers.findFirst({
    where: eq(customers.email, adminEmail)
  });

  if (!customer) {
    console.log('Customer not found, creating...');
    const password_hash = await bcrypt.hash(password, 12);
    const [newCustomer] = await db.insert(customers).values({
      email: adminEmail,
      name: 'Gamaliel Pec',
      password_hash,
      role: 'customer'
    }).returning();
    customer = newCustomer!;
    console.log(`✓ Created customer: ${customer.id}`);
  } else {
    console.log(`✓ Customer exists: ${customer.id}`);
  }

  // Check if admin exists
  let admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, adminEmail)
  });

  if (admin) {
    console.log(`✓ Admin already exists: ${admin.id} (${admin.role})`);
    return;
  }

  // Create admin user with password hash
  const password_hash = await bcrypt.hash(password, 12);
  const [newAdmin] = await db.insert(adminUsers).values({
    email: adminEmail,
    role: 'super_admin',
    password_hash
  }).returning();

  console.log(`✓ Created admin user: ${newAdmin!.id}`);
  console.log(`  Email: ${adminEmail}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role: super_admin`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the password immediately after first login!');
}

createAdmin().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
