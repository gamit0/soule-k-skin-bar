const steps = [
  {
    number: "1",
    title: "Descubre",
    description: "Responde el Skin Quiz en menos de dos minutos.",
  },
  {
    number: "2",
    title: "Personaliza",
    description: "Recibe tu cocktail: una rutina AM/PM hecha para tu piel.",
  },
  {
    number: "3",
    title: "Compra",
    description: "Agrega el cocktail completo al carrito en un clic.",
  },
  {
    number: "4",
    title: "Glow",
    description: "Sigue tu rutina y vuelve cuando tu cocktail necesite refill.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-y border-plum-ink/10 bg-blush/20 px-6 py-16 sm:px-10 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink sm:text-4xl">
          Cómo funciona
        </h2>

        <ol className="mt-10 grid gap-8 sm:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number}>
              <span className="font-[family-name:var(--font-display)] text-sm text-gold">
                {step.number}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl text-plum-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-plum-ink/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
