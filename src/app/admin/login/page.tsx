import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blush/20 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-plum-ink/10">
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-wine flex items-center justify-center text-ivory text-2xl mx-auto mb-4 shadow-inner">
            ✨
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-plum-ink">Soule K Admin</h1>
          <p className="text-plum-ink/50 mt-1">Inicia sesión para acceder al panel</p>
        </div>

        <form action={async (formData) => {
          'use server';
          const email = formData.get("email") as string;

          const admin = await db.query.adminUsers.findFirst({
            where: eq(adminUsers.email, email),
          });

          if (!admin) {
            redirect("/admin/login?error=unauthorized");
          }

          await signIn("credentials", {
            email,
            redirect: false,
            callbackUrl: "/admin",
          });

          redirect("/admin");
        }} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-plum-ink/70 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
              placeholder="admin@soulekskinbar.com"
            />
          </div>

          <button type="submit" className="w-full rounded-full bg-wine py-3 text-ivory font-medium hover:bg-wine-dark transition-colors">
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-plum-ink/50">
          Solo usuarios autorizados en adminUsers pueden acceder
        </p>
      </div>
    </div>
  );
}