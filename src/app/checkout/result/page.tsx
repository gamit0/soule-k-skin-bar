import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { orders } from "@/lib/db/schema";

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const paymentIntent = params.payment_intent as string;

  let status = "unknown";
  let order = null;

  if (paymentIntent) {
    order = await db.query.orders.findFirst({
      where: eq(orders.paymentProviderRef, paymentIntent),
    });
    status = order?.status || "unknown";
  }

  return (
    <>
      <Header />
      <main className="shell section min-h-screen flex items-center justify-center text-center">
        <div className="max-w-md animate-fade-in">
          {status === "paid" || status === "completed" ? (
            <>
              <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-sage/20 flex items-center justify-center text-4xl">
                  ✅
                </div>
              </div>
              <h1 className="font-display text-4xl text-plum-ink mb-4">
                ¡Gracias por tu compra!
              </h1>
              <p className="text-plum-ink/70 mb-8">
                Tu orden <span className="font-semibold">#{order?.id}</span> ha sido procesada con éxito.
                Recibirás un correo de confirmación en breve.
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-wine/20 flex items-center justify-center text-4xl">
                  ❌
                </div>
              </div>
              <h1 className="font-display text-4xl text-plum-ink mb-4">
                Algo salió mal
              </h1>
              <p className="text-plum-ink/70 mb-8">
                No pudimos verificar el pago de tu orden. Por favor, intenta de nuevo o contacta a soporte.
              </p>
            </>
          )}

          <Link
            href="/"
            className="btn btn-outline btn-lg inline-flex"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
