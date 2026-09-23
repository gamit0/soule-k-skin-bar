import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(["editor", "super_admin"]);

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-plum-ink/10 px-6 py-8">
        <p className="font-[family-name:var(--font-display)] text-lg text-plum-ink">
          Soule K — Editor
        </p>
        <nav className="mt-8 flex flex-col gap-3 text-sm text-plum-ink/70">
          <Link href="/editor" className="hover:text-wine">Dashboard</Link>
          <Link href="/editor/products" className="hover:text-wine">Productos</Link>
          <Link href="/editor/shots" className="hover:text-wine">Shots</Link>
          <Link href="/editor/cocktails" className="hover:text-wine">Cocktails</Link>
          <Link href="/editor/quiz" className="hover:text-wine">Quiz</Link>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}