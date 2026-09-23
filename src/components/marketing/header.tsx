"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { track } from "@/lib/track";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { label: "Shots", href: "/shots" },
  { label: "Quiz de Piel", href: "/quiz" },
  { label: "Productos", href: "/#productos" },
  { label: "Cómo funciona", href: "/#como-funciona" },
] as const;

export function Header() {
  const { items } = useCart();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const userRole = session?.user?.role;
  const isAdmin = session?.user?.isAdmin;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body cuando el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-plum-ink/10 bg-ivory/90 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-ivory/60 backdrop-blur-md"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 sm:h-19">
        {/* Logo lockup */}
        <Link href="/" className="group flex shrink-0 items-baseline gap-2">
          <span className="font-display text-[1.35rem] leading-none tracking-tight text-plum-ink transition-colors group-hover:text-wine">
            Soule&nbsp;K
          </span>
          <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold xs:inline">
            Skincare
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[0.85rem] font-medium text-plum-ink/65 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative py-1 transition-colors hover:text-wine"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-wine transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Carrito, ${count} productos`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-all duration-300 hover:border-wine/40 hover:text-wine hover:shadow-soft active:scale-95"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-[0.65rem] font-bold text-ivory shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-all duration-300 hover:border-wine/40 hover:text-wine"
              >
                <span className="text-sm font-medium">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-plum-ink/10 bg-ivory shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-plum-ink/10">
                    <p className="text-sm font-medium text-plum-ink">{session.user?.name || "Usuario"}</p>
                    <p className="text-xs text-plum-ink/60 truncate">{session.user?.email}</p>
                    {userRole && (
                      <span className={`mt-1 inline-block px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide rounded-full ${userRole === 'super_admin' ? 'bg-wine/10 text-wine' : userRole === 'editor' ? 'bg-gold/10 text-gold' : userRole === 'support' ? 'bg-sage/10 text-sage' : 'bg-plum-ink/10 text-plum-ink'}`}>
                        {userRole === 'super_admin' ? 'Super Admin' : userRole === 'editor' ? 'Editor' : userRole === 'support' ? 'Soporte' : 'Cliente'}
                      </span>
                    )}
                  </div>

                  {/* Admin / Editor / Support Panels */}
                  {isAdmin && userRole === 'super_admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </span>
                      Panel de Admin
                    </Link>
                  )}

                  {isAdmin && userRole === 'editor' && (
                    <Link
                      href="/editor"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </span>
                      Panel de Editor
                    </Link>
                  )}

                  {isAdmin && userRole === 'support' && (
                    <Link
                      href="/support"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </span>
                      Panel de Soporte
                    </Link>
                  )}

                  {/* Customer Account */}
                  {!isAdmin && (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </span>
                        Mi Cuenta
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </span>
                        Mis pedidos
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                        Direcciones
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </span>
                        Perfil
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-plum-ink/65 hover:text-wine transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex text-sm font-medium bg-wine text-ivory px-4 py-2 rounded-full hover:bg-wine-dark transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* Primary CTA — desktop */}
          <Link
            href="/quiz"
            onClick={() => track("quiz_started", { source: "header" })}
            className="btn btn-primary btn-md btn-arrow hidden sm:inline-flex"
          >
            Descubrir mi Shot
            <span className="arrow">→</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-colors hover:text-wine md:hidden"
          >
            <span
              className={`h-px w-4.5 bg-current transition-all duration-300 ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-4.5 bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-4.5 bg-current transition-all duration-300 ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile sliding menu */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 md:hidden ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="shell flex flex-col gap-1 border-t border-plum-ink/5 pb-6 pt-4">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-2xl px-3 py-3.5 font-display text-lg text-plum-ink transition-colors hover:bg-blush/25 hover:text-wine"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {l.label}
              <span className="text-plum-ink/30">→</span>
            </Link>
          ))}
          <Link
            href="/quiz"
            onClick={() => {
              setMenuOpen(false);
              track("quiz_started", { source: "header_mobile" });
            }}
            className="btn btn-primary btn-md mt-4 w-full"
          >
            Descubrir mi Shot →
          </Link>
        </nav>
      </div>
    </header>
  );
}

function BagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h12l1.4 12.3a1.5 1.5 0 0 1-1.5 1.7H6.1a1.5 1.5 0 0 1-1.5-1.7L6 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}