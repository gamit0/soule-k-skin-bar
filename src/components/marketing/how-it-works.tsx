export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Descubre",
      description: "Responde el Skin Quiz en menos de dos minutos.",
      icon: "🔬",
      accent: "chip-lilac",
      bg: "bg-lilac-light/30",
    },
    {
      number: "2",
      title: "Personaliza",
      description: "Recibe tu cocktail: una rutina AM/PM hecha para tu piel.",
      icon: "🧪",
      accent: "chip-gold",
      bg: "bg-gold-light/30",
    },
    {
      number: "3",
      title: "Compra",
      description: "Agrega el cocktail completo al carrito en un clic.",
      icon: "🛍️",
      accent: "chip-sage",
      bg: "bg-sage-light/30",
    },
    {
      number: "4",
      title: "Glow",
      description: "Sigue tu rutina y vuelve cuando tu cocktail necesite refill.",
      icon: "✨",
      accent: "chip-blush",
      bg: "bg-blush-light/30",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="shell section bg-blush/20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-up">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Cómo funciona
        </p>
        <h2 id="how-heading" className="mt-3 font-display text-4xl leading-tight text-plum-ink sm:text-5xl lg:text-6xl">
          Tu rutina en cuatro pasos
        </h2>
        <p className="mt-4 text-base text-plum-ink/70 sm:text-lg">
          Sin adivinanzas, sin productos innecesarios. Solo lo que tu piel
          necesita, en el orden correcto.
        </p>
      </div>

      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {steps.map((step, i) => (
          <li
            key={step.number}
            className={`card card-hover group relative overflow-hidden animate-fade-up ${step.bg}`}
            style={{ transitionDelay: `${100 + i * 100}ms` }}
            role="listitem"
          >
            <div className="p-6 sm:p-8 text-center">
              {/* Number badge */}
              <div className="mb-6 flex items-center justify-center">
                <span
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-plum-ink ${step.accent}`}
                >
                  {step.number}
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>

              {/* Icon */}
              <div className="mb-5 text-4xl animate-float" style={{ animationDelay: `${i * 0.5}s` }} aria-hidden="true">
                {step.icon}
              </div>

              <h3 className="font-display text-xl text-plum-ink mb-2 group-hover:text-wine transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-plum-ink/70 leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:absolute lg:top-[42px] lg:left-full lg:w-full lg:h-px lg:bg-gradient-to-r lg:from-wine/20 lg:to-transparent lg:pointer-events-none" aria-hidden="true" />
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Promise strip */}
      <div className="mt-14 animate-fade-up" style={{ transitionDelay: "500ms" }}>
        <div className="pearl-panel rounded-3xl border border-plum-ink/10 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-light/10 via-transparent to-transparent" />
          <h3 className="font-display text-xl sm:text-2xl text-plum-ink">
            Garantía Soule K
          </h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-plum-ink/65">
            <span className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden="true" />
              100% Original
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden="true" />
              Envío Gratis +$1.200
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-lilac" aria-hidden="true" />
              Asesoría Incluida
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-blush" aria-hidden="true" />
              Devolución 14 días
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}