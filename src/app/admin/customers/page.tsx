import { lt, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { customers } from "@/lib/db/schema";

// Fase 9 (CRM): segmentación simple "no compra hace 60+ días" —
// se puede evolucionar a un motor de segmentos más flexible más adelante.
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

export default async function AdminCustomersPage() {
  const allCustomers = await db.query.customers.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });

  const cutoff = new Date(Date.now() - SIXTY_DAYS_MS);
  const inactive = await db.query.customers.findMany({
    where: or(lt(customers.lastPurchaseAt, cutoff), isNull(customers.lastPurchaseAt)),
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Clientes
      </h1>

      <div className="mt-4 rounded-lg bg-blush/20 px-4 py-3 text-sm text-plum-ink/70">
        {inactive.length} cliente(s) sin compra en los últimos 60 días —
        candidatos para campaña de recompra (Fase 10, WhatsApp).
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-plum-ink/10 text-left text-plum-ink/50">
            <th className="py-2">Nombre</th>
            <th>Email</th>
            <th>WhatsApp</th>
            <th>Pedidos</th>
            <th>Última compra</th>
          </tr>
        </thead>
        <tbody>
          {allCustomers.map((c) => (
            <tr key={c.id} className="border-b border-plum-ink/5">
              <td className="py-2">{c.name ?? "—"}</td>
              <td>{c.email}</td>
              <td>{c.phone ?? "—"}</td>
              <td>{c.totalOrders}</td>
              <td>{c.lastPurchaseAt ? new Date(c.lastPurchaseAt).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
