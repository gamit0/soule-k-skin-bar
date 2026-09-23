import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

export default async function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(["support", "super_admin", "editor"]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-plum-ink/10 px-6 py-8">
        <p className="font-[family-name:var(--font-display)] text-lg text-plum-ink">
          Soule K — Soporte
        </p>
        <nav className="mt-8 flex flex-col gap-3 text-sm text-plum-ink/70">
          <Link href="/support" className="hover:text-wine">Dashboard</Link>
          <Link href="/support/orders" className="hover:text-wine">Pedidos</Link>
          <Link href="/support/customers" className="hover:text-wine">Clientes</Link>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}