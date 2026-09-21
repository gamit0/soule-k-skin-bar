import { db } from "@/lib/db/client";
import { customers, adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Create first admin user if none exists.
 * Run this script once to bootstrap admin access.
 *
 * Usage:
 *   npx tsx src/lib/admin/bootstrap.ts
 *
 * Set FIRST_ADMIN_EMAIL in .env to auto-promote a user.
 */

async function bootstrapAdmin() {
  // Check if any admin users exist
  const existingAdmins = await db.query.adminUsers.findMany();

  if (existingAdmins.length > 0) {
    console.log("Admin users already exist:");
    existingAdmins.forEach(a => console.log(`  - ${a.email} (${a.role})`));
    return;
  }

  const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;

  if (firstAdminEmail) {
    // Try to find existing customer with this email
    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, firstAdminEmail),
    });

    if (customer) {
      // Create admin user linked to existing customer
      const password = process.env.FIRST_ADMIN_PASSWORD || "admin123";
      const password_hash = await bcrypt.hash(password, 12);

      await db.insert(adminUsers).values({
        email: firstAdminEmail,
        role: "super_admin",
        password_hash,
      });

      console.log(`✅ Admin user created from existing customer: ${firstAdminEmail}`);
      console.log(`   Password: ${password} (CHANGE THIS IMMEDIATELY)`);
    } else {
      console.log(`❌ Customer with email ${firstAdminEmail} not found. Create account first.`);
    }
  } else {
    console.log("❌ FIRST_ADMIN_EMAIL not set in .env");
    console.log("   Set FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD in .env to bootstrap admin");
  }
}

bootstrapAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });