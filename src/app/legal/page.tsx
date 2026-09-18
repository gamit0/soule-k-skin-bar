import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export default function AvisoLegal() {
  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="font-display text-4xl text-plum-ink mb-8">Aviso Legal</h1>
          <div className="space-y-6 text-base leading-relaxed text-plum-ink/70">
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">1. Información General</h2>
              <p>
                Este sitio web es operado por <strong>Soule K Skin Bar</strong>. Todos los contenidos,
                incluyendo textos, imágenes, logotipos y diseños, son propiedad exclusiva de Soule K Skin Bar
                o de sus proveedores de contenido, y están protegidos por las leyes de propiedad intelectual.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">2. Uso del Sitio</h2>
              <p>
                El acceso y uso de este sitio web implica la aceptación total de los términos aquí expuestos.
                Queda prohibida la reproducción total o parcial de los contenidos sin el consentimiento previo y por escrito.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">3. Responsabilidad</h2>
              <p>
                Soule K Skin Bar se esfuerza por mantener la información actualizada y correcta, pero no se hace responsable
                de errores u omisiones en los contenidos, ni de daños derivados del uso de la información proporcionada.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-plum-ink mb-3">4. Contacto</h2>
              <p>
                Para cualquier duda o consulta legal, puede contactarnos a través de nuestro formulario de contacto
                o mediante nuestro correo electrónico oficial.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
