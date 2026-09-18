import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { CocktailMenu } from "@/components/marketing/cocktail-menu";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { Philosophy } from "@/components/marketing/philosophy";
import { Testimonials } from "@/components/marketing/testimonials";
import { SocialProof } from "@/components/marketing/social-proof";
import { CtaStrip } from "@/components/marketing/cta-strip";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CocktailMenu />
        <HowItWorks />
        <FeaturedProducts />
        <Philosophy />
        <Testimonials />
        <SocialProof />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}