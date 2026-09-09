import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";

/**
 * Server-side guard para rutas /admin. No es middleware (los middlewares
 * de Next corren en edge runtime, y aquí queremos hacer una query normal
 * a Postgres) — se llama al inicio de cada page.tsx protegida.
 */
export async function requireAdmin(
  allowedRoles: Array<"super_admin" | "editor" | "support"> = [
    "super_admin",
    "editor",
    "support",
  ],
) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, session.user.email),
  });

  if (!admin || !allowedRoles.includes(admin.role)) {
    redirect("/");
  }

  return admin;
}
