import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { ProductCard } from "@/components/product/product-card";
import { db } from "@/lib/db/client";

export default async function ProductsPage() {
  const productsList = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.active, true),
  });

  const productImages = await db.query.productImages.findMany();

  const productsWithImages = productsList.map(product => {
    const img = productImages.find(i => i.productId === product.id)?.url ||
                "https://images.unsplash.com/photo-1556228578-07257739599a?w=600";
    return { ...product, image: img };
  });

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-en_env_10 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-plum-ink sm:text-5xl">
              Catálogo de Productos
            </h1>
            <p className="mt-4 text-plum-ink/60 text-lg">
              Toda la magia del K-Beauty seleccionada para ti.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsWithImages.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
