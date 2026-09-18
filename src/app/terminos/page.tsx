import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function TerminosCondiciones() {
  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="font-display text-4xl text-plum-ink mb-8">Términos y Condiciones</h1>
          <div className="space-y-6 text-base leading-relaxed text-plum-ink/70">
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">1. Aceptación de Términos</h2>
              <p>
                Al utilizar el sitio web de Soule K Skin Bar y adquirir nuestros productos, usted acepta cumplir con
                estos Términos y Condiciones en su totalidad.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">2. El Diagnóstico K-Beauty</h2>
              <p>
                Nuestro motor de diagnóstico proporciona recomendaciones basadas en reglas deterministas.
                <strong>Importante:</strong> Estas recomendaciones no constituyen un diagnóstico médico ni sustituyen la consulta
                de un dermatólogo certificado. Soule K Skin Bar no es un servicio médico.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">3. Pagos y Envíos</h2>
              <p>
                Todos los precios están expresados en Pesos Mexicanos (MXN). El envío se realizará a la dirección proporcionada
                al momento de la compra. Los tiempos de entrega pueden variar según la ubicación.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">4. Política de Devoluciones</h2>
              <p>
                Debido a la naturaleza de nuestros productos (cuidado personal e higiene), no se aceptan devoluciones
                una vez que el producto ha sido abierto o utilizado. En caso de defectos de fábrica, por favor contáctenos
                dentro de los primeros 7 días tras la recepción.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
