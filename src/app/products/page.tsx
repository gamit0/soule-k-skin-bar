import { getActiveProducts } from "@/server/repositories/product-repository";
import { ProductCard } from "@/components/product/product-card";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export const metadata = { title: "Catálogo — Soule K Skin Bar" };

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-plum-ink">
            Catálogo
          </h1>

          {products.length === 0 ? (
            <p className="mt-8 text-plum-ink/60">
              Todavía no hay productos cargados. Ve al panel admin para
              agregar el primero.
            </p>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
