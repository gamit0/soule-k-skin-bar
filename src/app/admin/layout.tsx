import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-plum-ink/10 px-6 py-8">
        <p className="font-[family-name:var(--font-display)] text-lg text-plum-ink">
          Soule K — Admin
        </p>
        <nav className="mt-8 flex flex-col gap-3 text-sm text-plum-ink/70">
          <Link href="/admin" className="hover:text-wine">Dashboard</Link>
          <Link href="/admin/products" className="hover:text-wine">Productos</Link>
          <Link href="/admin/shots" className="hover:text-wine">Shots</Link>
          <Link href="/admin/cocktails" className="hover:text-wine">Cocktails</Link>
          <Link href="/admin/quiz" className="hover:text-wine">Quiz</Link>
          <Link href="/admin/orders" className="hover:text-wine">Pedidos</Link>
          <Link href="/admin/customers" className="hover:text-wine">Clientes</Link>
          <Link href="/admin/users" className="hover:text-wine">Usuarios Admin</Link>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
