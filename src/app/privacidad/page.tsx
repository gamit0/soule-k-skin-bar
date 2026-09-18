import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function PoliticaPrivacidad() {
  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="font-display text-4xl text-plum-ink mb-8">Política de Privacidad</h1>
          <div className="space-y-6 text-base leading-relaxed text-plum-ink/70">
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">1. Recopilación de Datos</h2>
              <p>
                En Soule K Skin Bar, recopilamos información personal únicamente cuando usted la proporciona voluntariamente,
                específicamente a través de nuestro <strong>Skin Quiz</strong>, el proceso de registro y la realización de pedidos.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">2. Uso de la Información</h2>
              <p>
                Los datos recopilados se utilizan para:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Procesar y enviar sus pedidos de skincare.</li>
                <li>Generar recomendaciones personalizadas basadas en su diagnóstico de piel.</li>
                <li>Mejorar la experiencia de usuario en nuestra plataforma.</li>
                <li>Enviar comunicaciones de marketing, siempre que usted lo haya autorizado.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">3. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra
                acceso no autorizado, alteración o destrucción. No vendemos ni alquilamos sus datos a terceros.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">4. Sus Derechos</h2>
              <p>
                Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos personales en cualquier momento.
                Para ejercer estos derechos, puede contactarnos a través de nuestros canales oficiales.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
