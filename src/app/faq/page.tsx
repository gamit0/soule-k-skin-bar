import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

const FAQS = [
  {
    q: "¿Qué es el K-Beauty y por qué es diferente?",
    a: "La cosmética coreana (K-Beauty) se enfoca en la prevención y la hidratación profunda, utilizando ingredientes innovadores y naturales para lograr una piel radiante ('glass skin'). A diferencia de otros enfoques, prioriza la salud a largo plazo sobre la corrección agresiva."
  },
  {
    q: "¿Cómo funciona el diagnóstico de piel?",
    a: "Nuestro motor de diagnóstico analiza tus respuestas sobre el tipo de piel, preocupaciones y estilo de vida para recomendarte un 'Shot' o Cocktail de productos diseñado específicamente para tus necesidades."
  },
  {
    q: "¿Los productos son originales?",
    a: "Absolutamente. Todos nuestros productos son importados directamente de Corea del Sur y cuentan con certificaciones de autenticidad."
  },
  {
    q: "¿Puedo combinar los productos de mi Shot con otras marcas?",
    a: "Sí, pero recomendamos seguir la rutina sugerida para maximizar la eficacia de los activos. Si tienes dudas sobre la compatibilidad de un activo específico, puedes consultarnos."
  },
  {
    q: "¿En cuánto tiempo veré resultados?",
    a: "La piel tiene un ciclo de renovación de aproximadamente 28 días. Recomendamos usar tu rutina de manera constante durante al menos un mes para notar cambios significativos en la textura y luminosidad."
  }
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="font-display text-4xl text-plum-ink mb-8">Preguntas Frecuentes</h1>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-ivory border border-plum-ink/10 shadow-soft">
                <h3 className="font-display text-lg text-plum-ink font-semibold mb-2">{faq.q}</h3>
                <p className="text-plum-ink/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
