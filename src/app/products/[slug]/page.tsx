import { notFound } from "next/navigation";
import { getProductBySlug } from "@/server/repositories/product-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { productJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Soule K Skin Bar`,
    description: product.shortDescription ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://soulekskinbar.com"}/products/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, url)),
        }}
      />
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-blush/30" />

          <div>
            <p className="text-xs uppercase tracking-wide text-plum-ink/50">
              {product.brand}
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-plum-ink">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-plum-ink">${product.price} MXN</p>
            <p className="mt-6 text-plum-ink/70">{product.shortDescription}</p>

            {product.benefits.length > 0 && (
              <ul className="mt-6 space-y-1 text-sm text-plum-ink/70">
                {product.benefits.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={Number(product.price)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
