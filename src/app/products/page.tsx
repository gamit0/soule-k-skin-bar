import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { ProductCard } from "@/components/product/product-card";
import { mockFeaturedProducts } from "@/mock-data/products";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
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
            {mockFeaturedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
