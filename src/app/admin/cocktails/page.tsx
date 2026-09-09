import { db } from "@/lib/db/client";
import { createCocktail } from "./actions";

export default async function AdminCocktailsPage() {
  const allCocktails = await db.query.cocktails.findMany();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Cocktails
      </h1>
      <p className="mt-2 text-sm text-plum-ink/50">
        Para asociar productos a la rutina AM/PM de cada cocktail, usa
        Drizzle Studio (`npm run db:studio`) sobre la tabla
        `cocktail_products` hasta que se construya un editor visual
        dedicado — ver DOC-PENDIENTES.md.
      </p>

      <form action={createCocktail} className="mt-6 grid max-w-xl gap-3">
        <input name="name" placeholder="Nombre (ej. Hydration)" required className="rounded border border-plum-ink/15 px-3 py-2" />
        <input name="shortDescription" placeholder="Descripción corta" className="rounded border border-plum-ink/15 px-3 py-2" />
        <textarea name="description" placeholder="Descripción completa" className="rounded border border-plum-ink/15 px-3 py-2" />
        <button className="rounded-full bg-wine px-5 py-2 text-ivory">Crear cocktail</button>
      </form>

      <ul className="mt-10 divide-y divide-plum-ink/10 border-t border-plum-ink/10">
        {allCocktails.map((c) => (
          <li key={c.id} className="py-3 text-plum-ink">
            {c.name} <span className="text-sm text-plum-ink/40">/{c.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
