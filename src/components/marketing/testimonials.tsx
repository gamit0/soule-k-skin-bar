// Estructura lista para recibir testimonios reales (Fase 12+ / carga manual
// desde el admin). No se inventan citas de clientes.

type Testimonial = {
  quote: string;
  author: string;
};

const testimonials: Testimonial[] = [];

export function Testimonials() {
  return (
    <section className="px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink sm:text-4xl">
          Lo que dicen quienes ya probaron su cocktail
        </h2>

        {testimonials.length === 0 ? (
          <p className="mt-6 text-plum-ink/50">
            Estamos por lanzar. Los primeros testimonios aparecerán aquí en
            cuanto lleguen las primeras rutinas.
          </p>
        ) : (
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.author}>
                <p className="text-plum-ink/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-sm text-plum-ink/50">{t.author}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
