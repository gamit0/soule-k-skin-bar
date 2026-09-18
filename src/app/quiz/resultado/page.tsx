import { getShotBySlug } from "@/server/repositories/shot-repository";
import { getCocktailBySlug } from "@/server/repositories/cocktail-repository";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import {
  DiagnosticResultView,
  DiagnosticData,
} from "@/components/quiz/diagnostic-result-view";
import { SkinMood } from "@/types";

export const metadata = {
  title: "Tu Diagnóstico K-Beauty — Soule K Skin Bar",
};

export default async function DiagnosticResultPage({
  searchParams,
}: {
  searchParams: Promise<{ shot?: string; cocktail?: string }>;
}) {
  const { shot: shotSlug, cocktail: cocktailSlug } = await searchParams;

  let initialData: DiagnosticData | null = null;

  if (shotSlug && cocktailSlug) {
    const shot = await getShotBySlug(shotSlug);
    const cocktail = await getCocktailBySlug(cocktailSlug);

    if (shot && cocktail) {
      const shotProducts = shot.products ?? [];
      const cocktailProducts = cocktail.products ?? [];

      const amRoutine = [
        ...cocktailProducts.filter((p) => p.usage === "AM" || p.usage === "BOTH"),
      ];
      const pmRoutine = [
        ...cocktailProducts.filter((p) => p.usage === "PM" || p.usage === "BOTH"),
      ];

      for (const p of shotProducts) {
        if (p.usage === "AM" || p.usage === "BOTH") {
          if (!amRoutine.some((x) => x.id === p.id)) amRoutine.splice(1, 0, p);
        }
        if (p.usage === "PM" || p.usage === "BOTH") {
          if (!pmRoutine.some((x) => x.id === p.id)) pmRoutine.splice(1, 0, p);
        }
      }

      initialData = {
        primaryShot: shot,
        recommendedCocktail: cocktail,
        skinMood: shot.mood as SkinMood,
        // matchScore y scoreBreakdown provienen del engine real via sessionStorage/URL params.
        // Aquí solo se renderiza el fallback si no hay datos en sessionStorage.
        matchScore: 0,
        scoreBreakdown: {},
        amRoutine,
        pmRoutine,
        personalizedMessage: `Tu piel responderá con máxima luminosidad y salud dérmica con el tratamiento ${shot.name} combinado con la base diaria de ${cocktail.name}.`,
      };
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory px-6 py-12 sm:px-10 sm:py-20">
        <DiagnosticResultView initialData={initialData} />
      </main>
      <Footer />
    </>
  );
}
