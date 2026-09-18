"use client";

import { track } from "@/lib/track";

export function SocialProof() {
  return (
    <section className="border-t border-plum-ink/10 shell section" aria-labelledby="social-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="social-heading" className="font-display text-3xl sm:text-4xl text-plum-ink mb-10">
          Síguenos en nuestro Skin Bar
        </h2>

        <div className="flex items-center justify-center gap-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/soule_kskinbar/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("instagram_click")}
            aria-label="Instagram"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-all duration-300 hover:border-wine/40 hover:text-wine hover:shadow-soft active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:text-wine"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37C16 10.5 15.5 9.72 14.84 9.33" />
              <circle cx="12" cy="12" r="4" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold uppercase tracking-wider text-plum-ink/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Instagram
            </span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@soulekskinbar"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("tiktok_click")}
            aria-label="TikTok"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-all duration-300 hover:border-wine/40 hover:text-wine hover:shadow-soft active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:text-wine"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0-5 5" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold uppercase tracking-wider text-plum-ink/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              TikTok
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { source: "footer" })}
            aria-label="WhatsApp"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-plum-ink/10 bg-ivory text-plum-ink transition-all duration-300 hover:border-[#25d366]/40 hover:text-[#25d366] hover:shadow-soft active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors group-hover:text-[#25d366]"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold uppercase tracking-wider text-plum-ink/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              WhatsApp
            </span>
          </a>
        </div>

        <p className="mt-10 text-sm text-plum-ink/60 max-w-sm mx-auto">
          Contenido K-Beauty, rutinas reales y consejos de nuestras especialistas.
        </p>
      </div>
    </section>
  );
}