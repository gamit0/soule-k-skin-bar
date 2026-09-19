import { db } from "@/lib/db/client";
import { createProduct, updateProduct, toggleProductActive, deleteProduct } from "./actions";

const CONCERNS = ["acne", "darkSpots", "dehydration", "aging", "texture", "dullness", "pores", "oiliness", "sensitive", "redness"];
const SKIN_TYPES = ["dry", "oily", "combination", "normal", "sensitive", "all"];
const ROUTINE_STEPS = ["cleanser", "toner", "serum", "eye_cream", "moisturizer", "sunscreen", "treatment", "special_care"];
const USAGES = ["AM", "PM", "BOTH"];

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Productos
      </h1>

      {/* Create Product Form */}
      <form action={createProduct} className="mt-8 grid max-w-2xl gap-3">
        <input name="name" placeholder="Nombre" required className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="brand" placeholder="Marca" className="rounded border border-plum-ink/15 px-3 py-2" defaultValue="Soule Lab" />
        <input name="price" placeholder="Precio (MXN)" type="number" step="0.01" className="rounded border border-plum-ink/15 px-3 py-2" />
        <select name="routineStep" className="rounded border border-plum-ink/15 px-3 py-2">
          {ROUTINE_STEPS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select name="usage" className="rounded border border-plum-ink/15 px-3 py-2">
          {USAGES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <input name="stock" placeholder="Stock" type="number" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="shortDescription" placeholder="Descripción corta" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="description" placeholder="Descripción completa" className="rounded border border-plum-ink/15 px-3 py-2" />

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

        <div>
          <label className="text-sm text-plum-ink/60 block mb-1">Preocupaciones</label>
          <div className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <label key={c} className="flex items-center gap-1 text-sm">
                <input type="checkbox" name="concerns" value={c} className="rounded border-plum-ink/30" />
                {c}
              </label>
            ))}
          </div>
        </div>

        <button className="rounded-full bg-wine px-5 py-2 text-ivory">Crear producto</button>
      </form>

      <table className="mt-10 w-full text-sm">
        <thead>
          <tr className="border-b border-plum-ink/10 text-left text-plum-ink/50">
            <th className="py-2">Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Paso</th>
            <th>Uso</th>
            <th>Stock</th>
            <th>Activo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((p) => (
            <tr key={p.id} className="border-b border-plum-ink/5">
              <td className="py-2">
                <form action={updateProduct.bind(null, p.id)} className="space-y-2">
                  <input type="hidden" name="brand" value={p.brand} />
                  <input type="hidden" name="price" value={p.price} />
                  <input type="hidden" name="routineStep" value={p.routineStep} />
                  <input type="hidden" name="usage" value={p.usage} />
                  <input type="hidden" name="stock" value={p.stock} />
                  <input type="hidden" name="active" value={p.active ? "on" : "off"} />
                  <input type="hidden" name="description" value={p.description ?? ""} />
                  {p.skinTypes.map((st) => <input key={st} type="hidden" name="skinTypes" value={st} />)}
                  {p.concerns.map((c) => <input key={c} type="hidden" name="concerns" value={c} />)}

                  <input name="name" defaultValue={p.name} className="text-plum-ink bg-transparent border-none focus:border-wine focus:outline-none px-1" />
                  {p.isMock && <span className="text-xs text-gold">(mock)</span>}
                </form>
              </td>
              <td>${p.brand}</td>
              <td>${p.price}</td>
              <td>{p.routineStep}</td>
              <td>{p.usage}</td>
              <td>{p.stock}</td>
              <td>
                <form action={toggleProductActive.bind(null, p.id, !p.active)}>
                  <button className="text-wine">{p.active ? "Desactivar" : "Activar"}</button>
                </form>
              </td>
              <td>
                <form action={deleteProduct.bind(null, p.id)}>
                  <button className="text-plum-ink/40 hover:text-wine">Eliminar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
