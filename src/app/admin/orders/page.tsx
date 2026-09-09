import { db } from "@/lib/db/client";
import { updateOrderStatus } from "./actions";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"] as const;

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    with: { items: true, customer: true },
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Pedidos
      </h1>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-plum-ink/10 text-left text-plum-ink/50">
            <th className="py-2">Pedido</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order) => (
            <tr key={order.id} className="border-b border-plum-ink/5">
              <td className="py-2">#{order.id.slice(0, 8)}</td>
              <td>{order.customer?.email ?? order.guestEmail ?? "—"}</td>
              <td>${order.total}</td>
              <td>
                <form action={async (formData: FormData) => {
                  "use server";
                  await updateOrderStatus(order.id, formData.get("status") as typeof STATUSES[number]);
                }}>
                  <select name="status" defaultValue={order.status} className="rounded border border-plum-ink/15 px-2 py-1">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button type="submit" className="ml-2 text-wine">Guardar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
