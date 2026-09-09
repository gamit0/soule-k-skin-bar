export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <span className="font-[family-name:var(--font-display)] text-lg tracking-tight text-plum-ink">
        Soule K
      </span>
      <nav className="hidden items-center gap-8 text-sm text-plum-ink/70 sm:flex">
        <a href="#cocktails" className="hover:text-plum-ink">
          Cocktails
        </a>
        <a href="#productos" className="hover:text-plum-ink">
          Productos
        </a>
        <a href="#como-funciona" className="hover:text-plum-ink">
          Cómo funciona
        </a>
      </nav>
      <a
        href="/quiz"
        className="rounded-full border border-plum-ink/15 px-4 py-2 text-sm text-plum-ink transition-colors hover:border-wine hover:text-wine"
      >
        Iniciar sesión
      </a>
    </header>
  );
}
