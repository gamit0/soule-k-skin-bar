import 'dotenv/config';
import { db } from '@/lib/db/client';
import { adminUsers, customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

type AdminRole = 'super_admin' | 'editor' | 'support';

interface CreateAdminOptions {
  email: string;
  password: string;
  role: AdminRole;
  name?: string;
}

/**
 * Crea un usuario admin con permisos específicos
 *
 * Roles disponibles:
 * - super_admin: Acceso completo, puede eliminar productos/usuarios
 * - editor: Puede crear/editar productos, shots, ver usuarios
 * - support: Solo lectura, puede ver pedidos y clientes
 */
export async function createAdminUser({
  email,
  password,
  role,
  name
}: CreateAdminOptions) {
  // Verificar si ya existe
  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email)
  });

  if (existing) {
    throw new Error(`El usuario ${email} ya existe como admin`);
  }

  // Crear usuario en tabla customers si no existe
  let customer = await db.query.customers.findFirst({
    where: eq(customers.email, email)
  });

  if (!customer) {
    const password_hash = await bcrypt.hash(password, 12);
    const [newCustomer] = await db.insert(customers).values({
      email,
      name: name || email.split('@')[0],
      password_hash,
      role: 'customer'
    }).returning();
    customer = newCustomer!;
    console.log(`✓ Creado customer: ${customer.id}`);
  }

  // Crear usuario admin
  const password_hash = await bcrypt.hash(password, 12);
  const [newAdmin] = await db.insert(adminUsers).values({
    email,
    role,
    password_hash
  }).returning();

  console.log(`✓ Creado admin: ${newAdmin!.id}`);
  console.log(`  Email: ${email}`);
  console.log(`  Rol: ${role}`);
  console.log(`  Password: ${password}`);

  return newAdmin!;
}

// Ejemplo de uso:
// createAdminUser({
//   email: 'editor@soulekskinbar.com',
//   password: 'editor123',
//   role: 'editor',
//   name: 'Editor Name'
// });