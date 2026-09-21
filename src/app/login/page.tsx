"use client";

import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      window.location.href = "/account/orders";
    }
  };

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-sm">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink text-center">
            Bienvenida de vuelta
          </h1>
          <p className="mt-3 text-center text-plum-ink/70">
            Inicia sesión para ver tu rutina guardada y tu historial de pedidos.
          </p>

          <form action="/api/auth/signin/google" method="POST" className="mt-8">
            <button
              type="submit"
              className="w-full rounded-full border border-plum-ink/15 px-6 py-3 text-plum-ink transition-colors hover:border-wine hover:text-wine"
            >
              Continuar con Google
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-plum-ink/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-ivory px-2 text-plum-ink/50">O continúa con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}
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
                className="w-full rounded border border-plum-ink/15 px-4 py-3 text-plum-ink focus:outline-none focus:border-wine transition-colors"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-wine py-3 text-ivory font-medium hover:bg-wine-dark transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-plum-ink/50">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-wine hover:underline font-medium">
              Regístrate
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}