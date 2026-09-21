import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export default async function AdminUsersPage() {
  await requireAdmin(["super_admin"]);

  const users = await db.query.adminUsers.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
          Usuarios Admin
        </h1>
        <a
          href="#new-user"
          className="rounded-full bg-wine px-5 py-2 text-sm text-ivory hover:bg-wine-dark"
        >
          Nuevo usuario
        </a>
      </div>

      {/* Formulario para crear usuario */}
      <form
        action={createAdminUserAction}
        className="mt-8 rounded-xl border border-plum-ink/10 p-6"
        id="new-user"
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl text-plum-ink mb-4">
          Crear usuario admin
        </h2>

        <div className="grid gap-4 max-w-md">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded border border-plum-ink/15 px-3 py-2"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña temporal"
            required
            minLength={8}
            className="rounded border border-plum-ink/15 px-3 py-2"
          />

          <select
            name="role"
            required
            className="rounded border border-plum-ink/15 px-3 py-2"
          >
            <option value="">Seleccionar rol...</option>
            <option value="editor">Editor (leer/escribir productos)</option>
            <option value="support">Soporte (solo lectura)</option>
            <option value="super_admin">Super Admin (acceso completo)</option>
          </select>

          <div className="text-xs text-plum-ink/60 space-y-1">
            <p><strong>Editor:</strong> Puede crear/editar productos y shots</p>
            <p><strong>Soporte:</strong> Solo puede ver pedidos y clientes</p>
            <p><strong>Super Admin:</strong> Acceso completo incluyendo eliminación</p>
          </div>

          <button
            type="submit"
            className="rounded-full bg-wine px-5 py-2 text-ivory hover:bg-wine-dark"
          >
            Crear usuario
          </button>
        </div>
      </form>

      {/* Lista de usuarios existentes */}
      <table className="mt-10 w-full text-sm">
        <thead>
          <tr className="border-b border-plum-ink/10 text-left text-plum-ink/50">
            <th className="py-2">Email</th>
            <th>Rol</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-plum-ink/5">
              <td className="py-3">{user.email}</td>
              <td>
                <span className={`inline-block rounded px-2 py-1 text-xs ${
                  user.role === 'super_admin'
                    ? 'bg-wine/10 text-wine'
                    : user.role === 'editor'
                    ? 'bg-plum-ink/10 text-plum-ink'
                    : 'bg-blush/20 text-plum-ink/70'
                }`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                {user.email !== 'gamalielpec@gmail.com' && (
                  <form action={deleteAdminUserAction.bind(null, user.id)} className="inline">
                    <button className="text-plum-ink/40 hover:text-wine text-xs">
                      Eliminar
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function createAdminUserAction(formData: FormData) {
  "use server";

  await requireAdmin(["super_admin"]);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !role) {
    throw new Error("Todos los campos son obligatorios");
  }

  // Check if exists
  const existing = await db.query.adminUsers.findFirst({
    where: (a, { eq }) => eq(a.email, email)
  });

  if (existing) {
    throw new Error("El usuario ya existe");
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // Create admin user
  await db.insert(adminUsers).values({
    email,
    role: role as any,
    password_hash
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?created=true");
}

async function deleteAdminUserAction(id: string) {
  "use server";

  await requireAdmin(["super_admin"]);

  await db.delete(adminUsers).where(eq(adminUsers.id, id));

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
