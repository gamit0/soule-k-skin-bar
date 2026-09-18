"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import { db } from "@/lib/db/client";
import { products, productImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/* RoutineStep → color chip mapping. */
const STEP_CHIP: Record<string, string> = {
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

export function FeaturedProducts() {
  const [mounted, setMounted] = useState(false);
  const [featured, setFeatured] = useState<{
    slug: string;
    name: string;
    brand: string;
    price: string;
    routineStep: string;
    image: string;
    stock: number;
    ingredients: string[];
  }[]>([]);

  useEffect(() => {
    setMounted(true);
    async function loadFeatured() {
      try {
        const prods = await db.query.products.findMany({
          limit: 8,
          where: (p, { eq }) => eq(p.active, true),
        });
        const imgs = await db.query.productImages.findMany();

        const data = prods.map(p => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          price: p.price,
          routineStep: p.routineStep,
          stock: p.stock,
          ingredients: p.ingredients || [],
          image: imgs.find(i => i.productId === p.id)?.url || "https://images.unsplash.com/photo-1556228578-07257739599a?w=600",
        }));
        setFeatured(data);
      } catch (e) {
        console.error("Error loading featured products:", e);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section id="productos" className="shell section" aria-labelledby="products-heading">
      <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-up">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Productos destacados
        </p>
        <h2 id="products-heading" className="mt-3 font-display text-4xl leading-tight text-plum-ink sm:text-5xl lg:text-6xl">
          Activos puros, resultados reales
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-base text-plum-ink/70 sm:text-lg">
          Seleccionamos a mano cada fórmula. Cosmética coreana original con
          concentración clínica de activos.
        </p>
      </div>

      <div
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        role="list"
        aria-label="Productos destacados"
      >
        {featured.map((product, i) => {
          const stepChip = STEP_CHIP[product.routineStep] || "chip";

          return (
            <article
              key={product.slug}
              className="card card-hover group relative overflow-hidden animate-fade-up"
              style={{ transitionDelay: `${mounted ? 100 + i * 80 : 0}ms` }}
              role="listitem"
            >
              <Link
                href={`/products/${product.slug}`}
                onClick={() => track("product_viewed", { productId: product.slug, name: product.name })}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                {/* Image Placeholder */}
                <div className="relative aspect-[3/4] overflow-hidden bg-blush/20 flex items-center justify-center">
                  <span className="text-plum-ink/20 font-display text-4xl">SK</span>
                  {/* Stock badge */}
                  {(product.stock ?? 1) === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-plum-ink/70" role="alert">
                      <span className="font-display text-xl text-ivory">Agotado</span>
                    </div>
                  )}
                  {/* Routine step chip */}
                  <div className="absolute top-3 left-3">
                    <span className={`chip ${stepChip} shadow-soft`}>
                      {product.routineStep.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-plum-ink/50 mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-display text-lg text-plum-ink group-hover:text-wine transition-colors duration-300 line-clamp-2 mb-2">
                    {product.name}
                  </h3>

                  {/* Key ingredients */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {product.ingredients.slice(0, 2).map((ing, idx) => (
                        <span key={idx} className="chip chip-lilac text-[0.6rem] px-2 py-0.5">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-plum-ink/5">
                    <span className="font-display text-xl font-bold text-wine">
                      ${Number(product.price).toFixed(2)}
                      <span className="text-xs font-light text-plum-ink/60"> MXN</span>
                    </span>
                    <span className="text-[0.7rem] font-semibold text-plum-ink/50 group-hover:text-wine transition-colors">
                      Ver →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* View all CTA */}
      <div className="mt-14 animate-fade-up" style={{ transitionDelay: `${featured.length * 80 + 200}ms` }}>
        <div className="text-center">
          <Link
            href="/shots"
            className="btn btn-outline btn-lg inline-flex"
          >
            Ver todos los Shots y Productos
          </Link>
        </div>
      </div>
    </section>
  );
}
