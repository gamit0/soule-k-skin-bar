import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";

export default function EditorPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Panel de Editor
          </h1>
          <p className="mt-4 text-plum-ink/60">
            Gestión de contenido y catálogo
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/editor/products" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">🍶 Productos</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Crear, editar y gestionar productos</p>
            </Link>
            <Link href="/editor/shots" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">🍸 Shots</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Gestionar Shots K-Beauty</p>
            </Link>
            <Link href="/editor/cocktails" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">🧪 Cocktails</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Gestionar rutinas personalizadas</p>
            </Link>
            <Link href="/editor/quiz" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">📝 Quiz</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Preguntas y opciones del diagnóstico</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}