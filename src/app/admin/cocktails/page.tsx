import { db } from "@/lib/db/client";
import { createCocktail, updateCocktail, toggleCocktailActive, deleteCocktail } from "./actions";

const CONCERNS = ["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness"];
const SKIN_TYPES = ["dry", "oily", "combination", "normal", "sensitive", "all"];

export default async function AdminCocktailsPage() {
  const allCocktails = await db.query.cocktails.findMany({
    with: {
      productLinks: {
        with: { product: true },
      },
    },
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Cocktails
      </h1>
      <p className="mt-2 text-sm text-plum-ink/50">
        Gestiona los Cocktails (rutinas completas AM/PM). La asociación de productos se gestiona en Drizzle Studio (`npm run db:studio`) en la tabla `cocktail_products`.
      </p>

      {/* Create Cocktail Form */}
      <form action={createCocktail} className="mt-8 grid max-w-2xl gap-3">
        <input name="name" placeholder="Nombre (ej. Hydration)" required className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="shortDescription" placeholder="Descripción corta" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="description" placeholder="Descripción completa" className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="icon" placeholder="Icono (emoji)" className="rounded border border-plum-ink/15 px-3 py-2" defaultValue="✨" />
        <input name="image" placeholder="URL de imagen" className="rounded border border-plum-ink/15 px-3 py-2" />

        <div>
          <label className="text-sm text-plum-ink/60 block mb-1">Preocupaciones (concerns)</label>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <label key={c} className="flex items-center gap-1 text-sm">
                <input type="checkbox" name="concerns" value={c} className="rounded border-plum-ink/30" />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-plum-ink/60 block mb-1">Tipos de piel</label>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPES.map((st) => (
              <label key={st} className="flex items-center gap-1 text-sm">
                <input type="checkbox" name="skinTypes" value={st} className="rounded border-plum-ink/30" />
                {st}
              </label>
            ))}
          </div>
        </div>

        <button className="rounded-full bg-wine px-5 py-2 text-ivory">Crear cocktail</button>
      </form>

      {/* Cocktails List */}
      <div className="mt-10 space-y-4">
        {allCocktails.map((cocktail) => (
          <div key={cocktail.id} className="border border-plum-ink/10 rounded-xl p-4 bg-white">
            <form action={updateCocktail.bind(null, cocktail.id)} className="space-y-3">
              <input type="hidden" name="shortDescription" value={cocktail.shortDescription ?? ""} />
              <input type="hidden" name="description" value={cocktail.description ?? ""} />
              <input type="hidden" name="icon" value={cocktail.icon ?? ""} />
              <input type="hidden" name="image" value={cocktail.image ?? ""} />
              <input type="hidden" name="active" value={cocktail.active ? "on" : "off" } />
              {cocktail.concerns.map((c) => <input key={c} type="hidden" name="concerns" value={c} />)}
              {cocktail.skinTypes.map((st) => <input key={st} type="hidden" name="skinTypes" value={st} />)}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <input name="name" defaultValue={cocktail.name} className="font-[family-name:var(--font-display)] text-xl text-plum-ink bg-transparent border-none focus:border-wine focus:outline-none" />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-plum-ink/5 text-plum-ink rounded-full">/{cocktail.slug}</span>
                    {cocktail.concerns.map((c) => (
                      <span key={c} className="px-2 py-1 bg-wine/10 text-wine rounded-full">{c}</span>
                    ))}
                    {cocktail.skinTypes.map((st) => (
                      <span key={st} className="px-2 py-1 bg-blush/10 text-blush rounded-full">{st}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form action={toggleCocktailActive.bind(null, cocktail.id, !cocktail.active)}>
                    <button className="rounded-full bg-wine/10 px-3 py-1 text-sm text-wine hover:bg-wine/20 transition-colors">
                      {cocktail.active ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={deleteCocktail.bind(null, cocktail.id)}>
                    <button className="rounded-full bg-plum-ink/5 px-3 py-1 text-sm text-plum-ink/40 hover:bg-plum-ink/10 hover:text-wine transition-colors">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            </form>

            {/* Product count info */}
            <p className="mt-3 text-sm text-plum-ink/50">
              Productos asociados: {cocktail.productLinks.length} |{" "}
              <a href="/admin/cocktails" className="text-wine hover:underline">Gestionar en Drizzle Studio</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
