import { mockFeaturedProducts } from "@/mock-data/products";

export function FeaturedProducts() {
  return (
    <section id="productos" className="px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink sm:text-4xl">
          Productos destacados
        </h2>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {mockFeaturedProducts.map((product) => (
            <a
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="aspect-[3/4] rounded-2xl bg-blush/30 transition-colors group-hover:bg-blush/50" />
              <p className="mt-4 text-xs uppercase tracking-wide text-plum-ink/50">
                {product.brand}
              </p>
              <h3 className="mt-1 text-plum-ink">{product.name}</h3>
              <p className="mt-1 text-sm text-plum-ink/70">
                ${product.price} MXN
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
