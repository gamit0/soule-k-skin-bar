import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const metadata = { title: "Crear cuenta — Soule K Skin Bar" };

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink text-center">
            Crea tu cuenta
          </h1>
          <p className="mt-3 text-center text-plum-ink/70">
            Guarda tu rutina personalizada y accede a tu historial de pedidos.
          </p>

          <form action={registerAction} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-plum-ink/70 mb-1">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-plum-ink/70 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-plum-ink/70 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-plum-ink/70 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-wine py-3 text-ivory font-medium hover:bg-wine-dark transition-colors"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-plum-ink/50">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-wine hover:underline font-medium">
              Inicia sesión
            </a>
          </p>

          <hr className="my-8 border-plum-ink/10" />

          <form action="/api/auth/signin/google" method="POST">
            <button
              type="submit"
              className="w-full rounded-full border border-plum-ink/15 px-6 py-3 text-plum-ink transition-colors hover:border-wine hover:text-wine"
            >
              Continuar con Google
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function registerAction(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password || !confirmPassword) {
    throw new Error("Todos los campos son obligatorios");
  }

  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  // Check if email already exists
  const existing = await db.query.customers.findFirst({
    where: eq(customers.email, email),
  });

  if (existing) {
    throw new Error("Este email ya está registrado");
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // Create customer
  await db.insert(customers).values({
    name,
    email,
    password_hash,
    role: "customer",
  });

  redirect("/login?registered=true");
}