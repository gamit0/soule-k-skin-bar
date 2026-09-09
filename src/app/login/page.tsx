import { Header } from "@/components/marketing/header";

export const metadata = { title: "Iniciar sesión — Soule K Skin Bar" };

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-sm text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Bienvenida de vuelta
          </h1>
          <p className="mt-3 text-plum-ink/70">
            Inicia sesión para ver tu rutina guardada y tu historial de
            pedidos.
          </p>
          <form
            action="/api/auth/signin/google"
            method="POST"
            className="mt-8"
          >
            <button
              type="submit"
              className="w-full rounded-full border border-plum-ink/15 px-6 py-3 text-plum-ink transition-colors hover:border-wine hover:text-wine"
            >
              Continuar con Google
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
