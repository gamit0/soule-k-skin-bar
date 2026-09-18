import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function EnviosPage() {
  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="font-display text-4xl text-plum-ink mb-8">Envíos y Devoluciones</h1>
          <div className="space-y-8 text-base leading-relaxed text-plum-ink/70">
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">🚚 Información de Envío</h2>
              <p>
                En Soule K Skin Bar, nos aseguramos de que tus productos lleguen en perfectas condiciones.
                Realizamos envíos a todo México a través de mensajerías certificadas.
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li><strong>Tiempo de procesamiento:</strong> 1-2 días hábiles.</li>
                <li><strong>Tiempo de entrega:</strong> 3-7 días hábiles dependiendo de la zona.</li>
                <li><strong>Costo de envío:</strong> Envío gratuito en compras mayores a $1,500 MXN.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">📦 Política de Devoluciones</h2>
              <p>
                Debido a la naturaleza de nuestros productos (cuidado personal e higiene), <strong>no aceptamos devoluciones ni cambios</strong> una vez que el sello de seguridad haya sido roto o el producto haya sido abierto.
              </p>
              <p className="mt-3">
                Si recibes un producto dañado o incorrecto, por favor contáctanos en un plazo máximo de <strong>48 horas</strong> tras la recepción del paquete, adjuntando fotografías del estado del producto y la guía de envío.
              </p>
            </section>

            <section className="rounded-2xl bg-blush/10 p-6 border border-blush/30">
              <h3 className="font-display text-xl text-plum-ink mb-2">¿Tienes dudas sobre tu pedido?</h3>
              <p>Nuestro equipo de atención al cliente está listo para ayudarte. Escríbenos a través de la sección de contacto.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
