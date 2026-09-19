import { db } from "@/lib/db/client";
import { createShot, toggleShotActive, deleteShot, updateShot } from "./actions";

const CONCERNS = ["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness"];
const SKIN_TYPES = ["dry", "oily", "combination", "normal", "sensitive"];
const MOODS = ["Calm", "Glow", "Clean", "Hydrated", "Firm"];

export default async function AdminShotsPage() {
  const allShots = await db.query.shots.findMany({
    with: {
      productLinks: {
        with: { product: true },
        orderBy: (pl, { asc }) => [asc(pl.order)],
      },
    },
    orderBy: (s, { asc }) => [asc(s.name)],
  });

  const allProducts = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.active, true),
    orderBy: (p, { asc }) => [asc(p.name)],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Shots
      </h1>
      <p className="mt-2 text-sm text-plum-ink/50">
        Gestiona los Shots (tratamientos focalizados) y asocia productos a cada uno.
      </p>

      {/* Create Shot Form */}
      <form action={createShot} className="mt-8 grid max-w-2xl gap-3">
        <input name="name" placeholder="Nombre (ej. Hidra Power)" required className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="menuTitle" placeholder="Título del menú (ej. Hidratación Intensa)" className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="subtitle" placeholder="Subtítulo" className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="category" placeholder="Categoría" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="description" placeholder="Descripción completa" className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="icon" placeholder="Icono (emoji)" className="rounded border border-plum-ink/15 px-3 py-2" defaultValue="✨" />

        <div className="grid grid-cols-2 gap-3">
          <select name="mood" className="rounded border border-plum-ink/15 px-3 py-2">
            {MOODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

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

        <button className="rounded-full bg-wine px-5 py-2 text-ivory">Crear Shot</button>
      </form>

      {/* Shots List */}
      <div className="mt-10 space-y-6">
        {allShots.map((shot) => (
          <div key={shot.id} className="border border-plum-ink/10 rounded-xl p-6 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{shot.icon || "✨"}</span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl text-plum-ink">{shot.name}</h3>
                    <p className="text-sm text-plum-ink/60">{shot.menuTitle || shot.name}</p>
                  </div>
                </div>
                <p className="mt-1 text-sm text-plum-ink/50">{shot.subtitle || ""}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-plum-ink/5 text-plum-ink rounded-full">{shot.mood}</span>
                  <span className="px-2 py-1 bg-plum-ink/5 text-plum-ink rounded-full">{shot.category || "Personalized"}</span>
                  {shot.concerns.map((c) => (
                    <span key={c} className="px-2 py-1 bg-wine/10 text-wine rounded-full">{c}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <form action={toggleShotActive.bind(null, shot.id, !shot.active)}>
                  <button className="rounded-full bg-wine/10 px-3 py-1 text-sm text-wine hover:bg-wine/20 transition-colors">
                    {shot.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
                <form action={deleteShot.bind(null, shot.id)}>
                  <button className="rounded-full bg-plum-ink/5 px-3 py-1 text-sm text-plum-ink/40 hover:bg-plum-ink/10 hover:text-wine transition-colors">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>

            {/* Product Associations */}
            <div className="mt-6 pt-6 border-t border-plum-ink/10">
              <h4 className="font-medium text-plum-ink mb-3">Productos asociados ({shot.productLinks.length})</h4>

              {/* Current products */}
              <ul className="space-y-2 mb-4">
                {shot.productLinks.map((pl, index) => (
                  <li key={pl.product.id} className="flex items-center justify-between p-2 bg-plum-ink/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-plum-ink/50 w-6 text-center">{index + 1}</span>
                      <span className="text-sm text-plum-ink">{pl.product.name}</span>
                      <span className="text-xs text-plum-ink/40">${pl.product.price}</span>
                    </div>
                  </li>
                ))}
                {shot.productLinks.length === 0 && (
                  <li className="text-sm text-plum-ink/40 text-center py-4">Sin productos asociados</li>
                )}
              </ul>

              {/* Add product form */}
              <form action={updateShot.bind(null, shot.id)} className="grid max-w-xl gap-3">
                <input type="hidden" name="name" value={shot.name} />
                <input type="hidden" name="menuTitle" value={shot.menuTitle ?? ""} />
                <input type="hidden" name="subtitle" value={shot.subtitle ?? ""} />
                <input type="hidden" name="category" value={shot.category ?? ""} />
                <input type="hidden" name="description" value={shot.description ?? ""} />
                <input type="hidden" name="icon" value={shot.icon ?? ""} />
                <input type="hidden" name="mood" value={shot.mood} />
                {shot.concerns.map((c) => <input key={c} type="hidden" name="concerns" value={c} />)}
                {shot.skinTypes.map((st) => <input key={st} type="hidden" name="skinTypes" value={st} />)}
                <input type="hidden" name="active" value={shot.active ? "on" : "off"} />

                <div className="flex gap-2">
                  <select name="productId" className="flex-1 rounded border border-plum-ink/15 px-3 py-2">
                    <option value="">Seleccionar producto...</option>
                    {allProducts
                      .filter((p) => !shot.productLinks.some((pl) => pl.product.id === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                      ))}
                  </select>
                  <button className="rounded-full bg-wine/10 px-4 py-2 text-sm text-wine hover:bg-wine/20 transition-colors">
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function asc<T>(fn: (a: T) => any) {
  return { asc: fn };
}