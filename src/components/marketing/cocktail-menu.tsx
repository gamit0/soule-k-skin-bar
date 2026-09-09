import { mockCocktails } from "@/mock-data/cocktails";

export function CocktailMenu() {
  return (
    <section id="cocktails" className="px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink sm:text-4xl">
          ¿Qué necesita tu piel?
        </h2>
        <p className="mt-3 max-w-md text-plum-ink/70">
          Cada cocktail es una rutina completa, pensada para un problema de
          piel específico.
        </p>

        <ul className="mt-10 divide-y divide-plum-ink/10 border-t border-plum-ink/10">
          {mockCocktails.map((cocktail) => (
            <li key={cocktail.slug}>
              <a
                href={`/cocktails/${cocktail.slug}`}
                className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-wine"
              >
                <span className="font-[family-name:var(--font-display)] text-xl text-plum-ink group-hover:text-wine sm:text-2xl">
                  {cocktail.name}
                </span>
                <span className="hidden max-w-xs flex-1 text-right text-sm text-plum-ink/60 sm:block">
                  {cocktail.shortDescription}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
