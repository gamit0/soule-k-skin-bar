import { db } from "@/lib/db/client";
import { createProduct, toggleProductActive, deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Productos
      </h1>

      <form action={createProduct} className="mt-8 grid max-w-xl gap-3">
        <input name="name" placeholder="Nombre" required className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="brand" placeholder="Marca" className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="price" placeholder="Precio (MXN)" type="number" step="0.01" className="rounded border border-plum-ink/15 px-3 py-2" />
        <select name="routineStep" className="rounded border border-plum-ink/15 px-3 py-2">
          <option value="cleanser">Cleanser</option>
          <option value="serum">Serum</option>
          <option value="moisturizer">Moisturizer</option>
          <option value="sunscreen">Sunscreen</option>
          <option value="treatment">Treatment</option>
        </select>
        <input name="stock" placeholder="Stock" type="number" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="shortDescription" placeholder="Descripción corta" className="rounded border border-plum-ink/15 px-3 py-2" />
        <button className="rounded-full bg-wine px-5 py-2 text-ivory">Crear producto</button>
      </form>

      <table className="mt-10 w-full text-sm">
        <thead>
          <tr className="border-b border-plum-ink/10 text-left text-plum-ink/50">
            <th className="py-2">Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Activo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((p) => (
            <tr key={p.id} className="border-b border-plum-ink/5">
              <td className="py-2">
                {p.name} {p.isMock && <span className="text-xs text-gold">(mock)</span>}
              </td>
              <td>${p.price}</td>
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
