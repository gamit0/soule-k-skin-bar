import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { products, productImages } from "@/lib/db/schema";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

const STEP_ICONS: Record<string, string> = {
  cleanser: "🧴",
  toner: "💧",
  exfoliant: "✨",
  serum: "🧪",
  treatment: "💊",
  moisturizer: "🫧",
  eye_cream: "👁️",
  special_care: "⭐",
  sunscreen: "☀️",
};

const STEP_CHIPS: Record<string, string> = {
  cleanser: "chip-sage",
  toner: "chip-aqua",
  exfoliant: "chip-gold",
  serum: "chip-blush",
  treatment: "chip-lilac",
  moisturizer: "chip-blush",
  eye_cream: "chip-lilac",
  special_care: "chip-gold",
  sunscreen: "chip-sage",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    return { title: "Producto no encontrado" };
  }
  return {
    title: product.name,
    description:
      `${product.name} de ${product.brand} — ` +
      `Paso ${product.routineStep.replace("_", " ")} para tu rutina K-Beauty. ` +
      `Cosmética coreana original con ingredientes activos de alta concentración.`,
    openGraph: {
      title: product.name,
      description: `${product.name} — ${product.brand}`,
      images: [`/products/${product.slug}.jpg`],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) notFound();

  const images = await db.query.productImages.findMany({
    where: eq(productImages.productId, product.id),
  });

  const mainImage = images[0]?.url || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600";

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola Soule 💕 Quiero más información sobre ${product.name}`)}`
    : null;

  const stepIcon = STEP_ICONS[product.routineStep] || "📋";
  const stepChip = STEP_CHIPS[product.routineStep] || "chip";

  return (
    <>
      <Header />
      <main className="shell section min-h-screen">
        <div className="mx-auto max-w-5xl animate-fade-in">
          {/* Breadcrumb */}
          <nav className="mb-8 text-xs text-plum-ink/40">
            <span className="hover:text-wine transition-colors cursor-pointer">Inicio</span>
            <span className="mx-2">/</span>
            <span className="hover:text-wine transition-colors cursor-pointer">Productos</span>
            <span className="mx-2">/</span>
            <span className="text-plum-ink/70">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-blush/20 shadow-soft">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              {/* Routine step overlay */}
              <div className="absolute top-4 left-4">
                <span className={`chip ${stepChip} shadow-soft`}>
                  {stepIcon} {product.routineStep.replace("_", " ")}
                </span>
              </div>

              {/* Stock overlay */}
              {(product.stock ?? 1) === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-plum-ink/60" role="alert">
                  <span className="font-display text-2xl text-ivory">Agotado</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              {/* Brand */}
              <p className="text-xs font-semibold uppercase tracking-widest text-plum-ink/50">
                {product.brand}
              </p>

              {/* Name */}
              <h1 className="mt-2 font-display text-3xl sm:text-4xl text-plum-ink font-normal leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-wine">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-plum-ink/50 font-light">MXN</span>
              </div>

              {/* Key ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.ingredients.map((ing, idx) => (
                    <span key={idx} className="chip chip-lilac text-[0.65rem]">
                      {ing}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="mt-6 text-base leading-relaxed text-plum-ink/70">
                Este producto es parte de nuestra selección premium de K-Beauty,
                especialmente formulado para el paso{" "}
                <span className="font-semibold text-plum-ink">{product.routineStep.replace("_", " ")}</span>{" "}
                en tu rutina diaria. Fórmula original coreana con ingredientes activos de
                alta concentración.
              </p>

              {/* Usage info */}
              <div className="mt-6 rounded-2xl bg-blush/15 p-4 border border-blush/30">
                <div className="flex items-center gap-2 text-sm font-semibold text-plum-ink">
                  <span>{stepIcon}</span>
                  <span>Paso: {product.routineStep.replace("_", " ")}</span>
                </div>
                {product.ingredients && product.ingredients.length > 0 && (
                  <p className="mt-2 text-xs text-plum-ink/60">
                    Ingredientes clave: {product.ingredients.join(", ")}
                  </p>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3">
                <AddToCartButton
                  productId={product.slug}
                  name={product.name}
                  price={Number(product.price)}
                />
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-md border-plum-ink/15 text-plum-ink hover:border-[#25d366] hover:text-[#25d366]"
                  >
                    💬 Consultar por WhatsApp
                  </a>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-plum-ink/10 space-y-2.5 text-xs text-plum-ink/50">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage shrink-0" />
                  <span>100% Cosmética Coreana Original</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-wine shrink-0" />
                  <span>Envío rápido a todo México</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span>Asesoría personalizada de uso incluida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
