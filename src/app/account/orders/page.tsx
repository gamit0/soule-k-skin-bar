import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const myOrders = await db.query.orders.findMany({
    where: eq(orders.customerId, session.user.id as string),
    with: { items: true },
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
            Mis pedidos
          </h1>

          {myOrders.length === 0 ? (
            <p className="mt-6 text-plum-ink/60">Aún no tienes pedidos.</p>
          ) : (
            <ul className="mt-8 divide-y divide-plum-ink/10 border-t border-plum-ink/10">
              {myOrders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-plum-ink">
                      Pedido #{order.id.slice(0, 8)}
                    </p>
                    <span className="text-sm text-plum-ink/50">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-plum-ink/60">
                    {order.items.length} producto(s) · ${order.total} MXN
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
