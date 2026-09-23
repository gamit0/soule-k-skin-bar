import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Don't show account layout for admin users
  const isAdmin = (session.user as any)?.isAdmin;
  if (isAdmin) redirect("/admin");

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r border-plum-ink/10 px-6 py-8 hidden md:block">
          <p className="font-[family-name:var(--font-display)] text-lg text-plum-ink">
            Mi Cuenta
          </p>
          <nav className="mt-8 flex flex-col gap-3 text-sm text-plum-ink/70">
            <Link href="/account" className="hover:text-wine flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Resumen
            </Link>
            <Link href="/account/orders" className="hover:text-wine flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Mis pedidos
            </Link>
            <Link href="/account/addresses" className="hover:text-wine flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Direcciones
            </Link>
            <Link href="/account/profile" className="hover:text-wine flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Perfil
            </Link>
          </nav>
        </aside>
        <main className="flex-1 px-6 py-16 sm:px-10 sm:py-24">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}