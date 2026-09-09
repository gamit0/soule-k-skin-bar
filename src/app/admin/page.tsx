import { db } from "@/lib/db/client";
import { orders, products, customers } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function AdminDashboard() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
  const [customerCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers);
  const [paidOrders] = await db
    .select({ count: sql<number>`count(*)`, total: sql<number>`coalesce(sum(total), 0)` })
    .from(orders)
    .where(eq(orders.status, "paid"));

  const stats = [
    { label: "Productos activos", value: productCount?.count ?? 0 },
    { label: "Clientes", value: customerCount?.count ?? 0 },
    { label: "Pedidos pagados", value: paidOrders?.count ?? 0 },
    { label: "Ventas totales (MXN)", value: `$${paidOrders?.total ?? 0}` },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Dashboard
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-plum-ink/10 p-5">
            <p className="text-2xl text-plum-ink">{s.value}</p>
            <p className="mt-1 text-sm text-plum-ink/50">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
