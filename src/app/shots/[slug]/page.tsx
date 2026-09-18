import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getShotBySlug, getActiveShots } from "@/server/repositories/shot-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AddShotToCartButton } from "@/components/cart/add-shot-to-cart-button";
import { ConsultationSection } from "@/components/cocktail/consultation-section";

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

export async function generateStaticParams() {
  const shots = await getActiveShots();
  return shots.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shot = await getShotBySlug(slug);
  if (!shot) {
    return { title: "Shot no encontrado" };
  }
  const products = shot.products ?? [];
  return {
    title: shot.name,
    description:
      `${shot.name} — Shot ${shot.category} para ${shot.mood.toLowerCase()}. ` +
      `${products.length} productos con activos coreanos puros. ` +
      `Precio: $${shot.totalPrice?.toFixed(2)} MXN.`,
    openGraph: {
      title: shot.name,
      description: `${shot.name} — ${shot.subtitle}`,
      images: [`/shots/${shot.slug}.jpg`],
    },
  };
}

export default async function ShotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shot = await getShotBySlug(slug);

  if (!shot) notFound();

  const products = shot.products ?? [];

  return (
    <>
      <Header />
      <main className="shell section min-h-screen">
        <div className="mx-auto max-w-4xl animate-fade-in">
          {/* Breadcrumb */}
          <nav className="mb-8 text-xs text-plum-ink/40">
            <Link href="/shots" className="hover:text-wine transition-colors cursor-pointer">
              Menú de Shots
            </Link>
            <span className="mx-2">/</span>
            <span className="text-plum-ink/70">{shot.name}</span>
          </nav>

          {/* Shot Header Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blush/20 via-ivory to-blush/10 border border-plum-ink/8 p-8 sm:p-12 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-4xl">{shot.icon}</span>
                  <span className="chip chip-wine text-[0.6rem]">
                    {shot.category}
                  </span>
                  <span className="chip chip-lilac text-[0.6rem]">
                    Mood: {shot.mood}
                  </span>
                </div>
                <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-plum-ink font-normal leading-tight text-balance">
                  {shot.name}
                </h1>
                <p className="mt-2 text-base sm:text-lg font-medium text-wine/80">
                  {shot.subtitle}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-plum-ink/70">
                  {shot.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 sm:border-l border-plum-ink/10 sm:pl-6 min-w-[160px] pt-4 sm:pt-0 border-t sm:border-t-0">
                <span className="text-[0.65rem] uppercase tracking-wider text-plum-ink/40 font-medium">
                  Precio del Kit
                </span>
                <span className="font-display text-3xl sm:text-4xl text-wine font-bold tabular-nums">
                  ${shot.totalPrice?.toFixed(2)}
                </span>
                <span className="text-xs text-plum-ink/50 font-light">
                  MXN • {products.length} productos
                </span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-plum-ink/8">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-plum-ink/40 self-center mr-1">
                Ideal para:
              </span>
              {shot.skinTypes.map((st) => (
                <span key={st} className="chip chip-sage text-[0.6rem]">
                  Piel {st}
                </span>
              ))}
              {shot.concerns.map((c) => (
                <span key={c} className="chip chip-gold text-[0.6rem]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Formula / Included Products */}
          <div className="mt-14 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-plum-ink">
                  Fórmula y Productos
                </h2>
                <p className="mt-1 text-sm text-plum-ink/60">
                  Activos concentrados de alta pureza K-Beauty para tratar tu necesidad puntual.
                </p>
              </div>
              <span className="chip chip-wine text-[0.65rem]">
                {products.length} Pasos Focalizados
              </span>
            </div>

            <div className="space-y-4">
              {products.map((p, index) => {
                const stepIcon = STEP_ICONS[p.routineStep] || "📋";
                const stepChip = STEP_CHIPS[p.routineStep] || "chip";
                return (
                  <div
                    key={p.id}
                    className="group card card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine/8 text-sm font-bold text-wine">
                        0{index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-plum-ink/50">
                            {p.brand}
                          </span>
                          <span className="text-xs text-plum-ink/30">•</span>
                          <span className={`chip ${stepChip} text-[0.6rem] px-2 py-0.5`}>
                            {stepIcon} {p.routineStep.replace("_", " ")}
                          </span>
                          <span className="text-xs text-plum-ink/30">•</span>
                          <span className="text-xs font-medium text-plum-ink/70 capitalize">
                            {p.usage}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-base sm:text-lg font-medium text-plum-ink">
                          {p.name}
                        </h3>
                        {p.shortDescription && (
                          <p className="mt-1 text-sm text-plum-ink/65 line-clamp-2">
                            {p.shortDescription}
                          </p>
                        )}
                        {p.ingredients && p.ingredients.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {p.ingredients.slice(0, 3).map((ing, i) => (
                              <span key={i} className="chip chip-lilac text-[0.6rem]">
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5 sm:gap-0.5 min-w-[100px]">
                      <span className="font-bold text-plum-ink text-base sm:text-lg tabular-nums">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      <span className="text-[0.65rem] font-medium">
                        {(p.stock ?? 1) > 0 ? "En stock" : "Agotado"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Callouts */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-blush/20 to-pearl border border-wine/15 p-6 sm:p-8 shadow-soft animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-xl text-plum-ink">
                  ¿Lista para transformar tu piel?
                </h3>
                <p className="mt-1 text-sm text-plum-ink/70">
                  Agrega este Shot a tu carrito o consulta a nuestras especialistas por WhatsApp.
                </p>
              </div>
              <div className="w-full sm:w-auto min-w-[260px]">
                <AddShotToCartButton shot={shot} />
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Consultation */}
          <div className="mt-10 animate-fade-up">
            <ConsultationSection
              cocktailName={`Shot ${shot.name}`}
              products={products.map((p) => ({
                name: p.name,
                price: p.price,
              }))}
              total={shot.totalPrice ?? 0}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}