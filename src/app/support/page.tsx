import Link from "next/link";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Panel de Soporte
          </h1>
          <p className="mt-4 text-plum-ink/60">
            Gestión de pedidos y atención al cliente
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link href="/support/orders" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">📦 Pedidos</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Ver, filtrar y actualizar estado de pedidos</p>
            </Link>
            <Link href="/support/customers" className="rounded-2xl border border-plum-ink/10 bg-ivory p-6 hover:border-wine/30 transition-colors">
              <h2 className="font-display text-xl text-plum-ink">👥 Clientes</h2>
              <p className="mt-2 text-sm text-plum-ink/60">Buscar clientes y ver historial</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}