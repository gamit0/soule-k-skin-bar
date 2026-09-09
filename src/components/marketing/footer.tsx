export function Footer() {
  return (
    <footer className="border-t border-plum-ink/10 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <span className="font-[family-name:var(--font-display)] text-lg text-plum-ink">
          Soule K
        </span>
        <p className="text-sm text-plum-ink/50">
          © {new Date().getFullYear()} Soule K Skin Bar. Todos los derechos
          reservados.
        </p>
        <a
          href="#"
          className="text-sm text-plum-ink/70 hover:text-wine"
        >
          Hablar con una especialista
        </a>
      </div>
    </footer>
  );
}
