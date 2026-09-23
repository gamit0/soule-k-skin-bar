import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { eq, desc } from "drizzle-orm";
import { orders, addresses, customers } from "@/lib/db/schema";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const customerId = session.user.id as string;

  // Fetch recent orders
  const recentOrders = await db.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    limit: 3,
    with: { items: true },
  });

  // Fetch addresses
  const userAddresses = await db.query.addresses.findMany({
    where: eq(addresses.customerId, customerId),
    orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.createdAt)],
  });

  // Fetch customer profile
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  });

  const skinTypeLabels: Record<string, string> = {
    dry: "Seca",
    oily: "Grasa",
    combination: "Mixta",
    normal: "Normal",
    sensitive: "Sensible",
  };

  const concernLabels: Record<string, string> = {
    acne: "Acné",
    darkSpots: "Manchas",
    dehydration: "Deshidratación",
    aging: "Envejecimiento",
    texture: "Textura",
    dullness: "Opacidad",
    pores: "Poros",
    oiliness: "Exceso de grasa",
    sensitive: "Sensibilidad",
    redness: "Rojeces",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Mi Cuenta
          </p>
          <h1 className="mt-1 font-display text-3xl text-plum-ink font-normal">
            Hola, {session.user?.name || "Usuario"}
          </h1>
        </div>
        <Link
          href="/account/profile"
          className="btn btn-outline btn-sm self-start sm:self-center"
        >
          Editar perfil
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-5">
          <p className="text-sm text-plum-ink/60">Pedidos totales</p>
          <p className="mt-1 font-display text-2xl text-plum-ink font-bold tabular-nums">
            {customer?.totalOrders || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-5">
          <p className="text-sm text-plum-ink/60">Total gastado</p>
          <p className="mt-1 font-display text-2xl text-plum-ink font-bold tabular-nums">
            ${Number(customer?.totalSpent || 0).toFixed(2)} MXN
          </p>
        </div>
        <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-5">
          <p className="text-sm text-plum-ink/60">Direcciones guardadas</p>
          <p className="mt-1 font-display text-2xl text-plum-ink font-bold tabular-nums">
            {userAddresses.length}
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-8 rounded-2xl border border-plum-ink/10 bg-ivory p-6">
        <h2 className="font-display text-lg text-plum-ink">Información de perfil</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">Nombre</dt>
            <dd className="mt-1 text-plum-ink">{session.user?.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">Email</dt>
            <dd className="mt-1 text-plum-ink">{session.user?.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">Teléfono</dt>
            <dd className="mt-1 text-plum-ink">{customer?.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">Tipo de piel</dt>
            <dd className="mt-1 text-plum-ink">
              {customer?.skinType ? skinTypeLabels[customer.skinType] : "—"}
            </dd>
          </div>
          {customer?.concerns?.length && (
            <div className="sm:col-span-2 lg:col-span-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">Preocupaciones</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {customer.concerns.map((c) => (
                  <span key={c} className="inline-flex items-center rounded-full bg-blush/20 px-2.5 py-0.5 text-xs font-medium text-wine">
                    {concernLabels[c] || c}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-plum-ink">Pedidos recientes</h2>
          <Link href="/account/orders" className="text-sm font-medium text-wine hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-plum-ink/10 bg-ivory p-8 text-center">
            <p className="text-plum-ink/60">Aún no tienes pedidos.</p>
            <Link href="/shots" className="mt-4 inline-block btn btn-primary btn-sm">
              Explorar Shots
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-plum-ink/10 bg-ivory divide-y divide-plum-ink/8">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders#${order.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-plum-ink/3 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-plum-ink truncate">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-sm text-plum-ink/50">
                    {order.items.length} producto(s) · ${order.total} MXN
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    order.status === "delivered"
                      ? "bg-sage/10 text-sage"
                      : order.status === "shipped"
                      ? "bg-gold/10 text-gold"
                      : order.status === "paid"
                      ? "bg-wine/10 text-wine"
                      : order.status === "cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-blush/20 text-wine"
                  }`}
                >
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-plum-ink">Direcciones guardadas</h2>
          <Link href="/account/addresses/new" className="btn btn-primary btn-sm">
            + Nueva dirección
          </Link>
        </div>
        {userAddresses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-plum-ink/10 bg-ivory p-8 text-center">
            <p className="text-plum-ink/60">No tienes direcciones guardadas.</p>
            <Link href="/account/addresses/new" className="mt-4 inline-block btn btn-primary btn-sm">
              Agregar primera dirección
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {userAddresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-plum-ink/10 bg-ivory p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-plum-ink">{address.name}</span>
                      {address.isDefault && (
                        <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[0.55rem] font-semibold text-sage uppercase">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <address className="mt-2 not-italic text-sm text-plum-ink/70 leading-relaxed">
                      {address.recipientName}<br />
                      {address.street}{" "}
                      {address.exteriorNumber}{" "}
                      {address.interiorNumber ? `Int. ${address.interiorNumber}` : ""}
                      {address.neighborhood ? `<br />${address.neighborhood}` : ""}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.phone}
                    </address>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/account/addresses/${address.id}/edit`}
                    className="text-sm font-medium text-wine hover:underline"
                  >
                    Editar
                  </Link>
                  {!address.isDefault && (
                    <button className="text-sm font-medium text-plum-ink/60 hover:text-wine">
                      Establecer como predeterminada
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}