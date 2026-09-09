import { notFound } from "next/navigation";
import { getCocktailBySlug } from "@/server/repositories/cocktail-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { RoutineList } from "@/components/cocktail/routine-list";
import { AddCocktailToCartButton } from "@/components/cart/add-cocktail-to-cart-button";

export default async function CocktailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cocktail = await getCocktailBySlug(slug);

  if (!cocktail) notFound();

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-wine">🍸 Tu cocktail es</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-plum-ink sm:text-5xl">
            {cocktail.name}
          </h1>
          <p className="mt-4 text-plum-ink/70">{cocktail.description}</p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <RoutineList title="☀️ Rutina AM" products={cocktail.routineAM} />
            <RoutineList title="🌙 Rutina PM" products={cocktail.routinePM} />
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <AddCocktailToCartButton
              cocktailId={cocktail.id}
              cocktailName={cocktail.name}
              products={[...cocktail.routineAM, ...cocktail.routinePM]}
            />
            <a
              href={`/contact?context=${encodeURIComponent(cocktail.name)}`}
              className="inline-flex items-center justify-center rounded-full border border-plum-ink/15 px-6 py-3 text-plum-ink transition-colors hover:border-wine hover:text-wine"
            >
              Hablar con una especialista
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
