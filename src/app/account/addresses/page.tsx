import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { eq, desc } from "drizzle-orm";
import { addresses } from "@/lib/db/schema";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const customerId = session.user.id as string;

  const userAddresses = await db.query.addresses.findMany({
    where: eq(addresses.customerId, customerId),
    orderBy: (a, { desc }) => [desc(a.isDefault), desc(a.createdAt)],
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Mi Cuenta
          </p>
          <h1 className="mt-1 font-display text-3xl text-plum-ink font-normal">
            Direcciones guardadas
          </h1>
        </div>
        <Link href="/account/addresses/new" className="btn btn-primary btn-sm self-start sm:self-center">
          + Nueva dirección
        </Link>
      </div>

      {userAddresses.length === 0 ? (
        <div className="rounded-2xl border border-plum-ink/10 bg-ivory p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-plum-ink/5">
            <svg className="w-8 h-8 text-plum-ink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-display text-xl text-plum-ink">No tienes direcciones guardadas</h2>
          <p className="mt-2 text-plum-ink/60 max-w-sm mx-auto">
            Guarda tus direcciones para agilizar el checkout en futuras compras.
          </p>
          <Link href="/account/addresses/new" className="mt-6 inline-block btn btn-primary">
            Agregar primera dirección
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {userAddresses.map((address) => (
            <div
              key={address.id}
              className="rounded-2xl border border-plum-ink/10 bg-ivory p-5 hover:border-wine/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-plum-ink">{address.name}</span>
                    {address.isDefault && (
                      <span className="rounded-full bg-sage/10 px-2 py-0.5 text-[0.55rem] font-semibold text-sage uppercase">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <address className="mt-3 not-italic text-sm text-plum-ink/70 leading-relaxed whitespace-pre-line">
                    {address.recipientName}
                    {address.street} {address.exteriorNumber}
                    {address.interiorNumber ? ` Int. ${address.interiorNumber}` : ""}
                    {address.neighborhood ? `\n${address.neighborhood}` : ""}
                    {address.city}, {address.state} {address.postalCode}
                    {address.phone}
                  </address>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/account/addresses/${address.id}/edit`}
                  className="flex-1 text-center rounded-lg border border-plum-ink/15 px-3 py-2 text-sm font-medium text-plum-ink hover:bg-plum-ink/5 transition-colors"
                >
                  Editar
                </Link>
                {!address.isDefault && (
                  <form action={`/api/addresses/${address.id}/default`} method="POST">
                    <button type="submit" className="flex-1 text-center rounded-lg border border-plum-ink/15 px-3 py-2 text-sm font-medium text-plum-ink hover:bg-plum-ink/5 transition-colors">
                      Establecer por defecto
                    </button>
                  </form>
                )}
                <form action={`/api/addresses/${address.id}`} method="POST">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" className="flex-1 text-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" onClick={(e) => { if (!confirm('¿Eliminar esta dirección?')) e.preventDefault(); }}>
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}