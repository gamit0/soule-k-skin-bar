"use client";

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
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-plum-ink/10 bg-ivory shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-plum-ink/10">
                    <p className="text-sm font-medium text-plum-ink">{session.user?.name || "Usuario"}</p>
                    <p className="text-xs text-plum-ink/60 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/account/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5"
                  >
                    Mis pedidos
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-plum-ink hover:bg-plum-ink/5"
                  >
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