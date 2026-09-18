import Link from "next/link";
import type { Route } from "next";

export function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Navegación",
      links: [
        { label: "Shots K-Beauty", href: "/shots" },
        { label: "Diagnóstico de Piel", href: "/quiz" },
        { label: "Productos", href: "/#productos" },
        { label: "Cómo funciona", href: "/#como-funciona" },
      ],
    },
    {
      title: "Ayuda",
      links: [
        { label: "Contacto", href: "/contacto" },
        { label: "Envíos y devoluciones", href: "/envios" },
        { label: "Preguntas frecuentes", href: "/faq" },
        { label: "Hablar con especialista", href: "https://wa.me/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Aviso legal", href: "/legal" },
        { label: "Política de privacidad", href: "/privacidad" },
        { label: "Términos y condiciones", href: "/terminos" },
      ],
    },
  ] as const satisfies readonly { title: string; links: readonly { label: string; href: string }[] }[];

  const social = [
    {
      href: "https://www.instagram.com/soule_kskinbar/",
      label: "Instagram",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37C16 10.5 15.5 9.72 14.84 9.33" />
          <circle cx="12" cy="12" r="4" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      href: "https://www.tiktok.com/@soulekskinbar",
      label: "TikTok",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0-5 5" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-plum-ink/10 bg-blush/10">
      <div className="shell section sm:section">
        <div className="grid gap-10 sm:grid-cols-[1fr_repeat(3,minmax(0,1fr))]">
          {/* Brand column */}
          <div className="flex flex-col gap-5 sm:col-span-1">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-xl tracking-tight text-plum-ink group-hover:text-wine transition-colors">
                Soule&nbsp;K
              </span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold">
                Skincare
              </span>
            </Link>
            <p className="text-sm text-plum-ink/65 leading-relaxed">
              Rutinas de alta potencia diseñadas por especialistas K-Beauty.
              Tu piel primero. Tu Shot ideal después.
            </p>
            <div className="flex items-center gap-4">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink/70 transition-all duration-300 hover:border-wine/40 hover:text-wine hover:shadow-soft active:scale-95"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="font-display text-base text-plum-ink mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href as Route}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-plum-ink/65 transition-colors hover:text-wine"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-plum-ink/10 pt-6 sm:flex-row">
          <p className="text-xs text-plum-ink/50">
            © {year} Soule K Skin Bar. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-plum-ink/50">
            <span>Hecho con ❤ en México</span>
            <span>|</span>
            <span>100% Cosmética Coreana Original</span>
          </div>
        </div>
      </div>
    </footer>
  );
}