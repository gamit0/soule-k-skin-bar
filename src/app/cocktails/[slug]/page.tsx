import { notFound } from "next/navigation";
import { getCocktailBySlug } from "@/server/repositories/cocktail-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { RoutineList } from "@/components/cocktail/routine-list";
import { AddCocktailToCartButton } from "@/components/cart/add-cocktail-to-cart-button";
import { BackToQuizButton } from "@/components/cocktail/back-to-quiz-button";
import { ConsultationSection } from "@/components/cocktail/consultation-section";

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
          <div className="mb-8">
            <BackToQuizButton />
          </div>

          <p className="text-sm text-wine">🍸 Tu cocktail es</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-plum-ink sm:text-5xl">
            {cocktail.name}
          </h1>
          <p className="mt-4 text-plum-ink/70">{cocktail.description}</p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <RoutineList title="☀️ Rutina AM" products={cocktail.routineAM} />
            <RoutineList title="🌙 Rutina PM" products={cocktail.routinePM} />
          </div>

          <div className="mt-12 flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddCocktailToCartButton
                cocktailId={cocktail.id}
                cocktailName={cocktail.name}
                products={[...cocktail.routineAM, ...cocktail.routinePM]}
              />
              <div className="flex-1" />
            </div>

            <ConsultationSection
              cocktailName={cocktail.name}
              products={([...cocktail.routineAM, ...cocktail.routinePM]).map(p => ({
                name: p.name,
                price: p.price
              }))}
              total={([...cocktail.routineAM, ...cocktail.routinePM]).reduce((sum, p) => sum + Number(p.price), 0)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
