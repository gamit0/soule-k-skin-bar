import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side guard para rutas de cliente autenticado.
 * Redirige a /login si no hay sesión válida.
 */
export async function requireCustomer() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}