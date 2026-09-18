export function Philosophy() {
  const pillars = [
    {
      icon: "🔬",
      title: "Ciencia K-Beauty",
      description:
        "Activos coreanos con concentración clínica. Cada ingrediente tiene un propósito y una dosis efectiva.",
      accent: "chip-lilac",
      bg: "bg-lilac-light/30",
    },
    {
      icon: "🎯",
      title: "Menos es más",
      description:
        "No cientos de productos. Un Shot focalizado + un Cocktail diario. Rutina completa, sin ruido.",
      accent: "chip-sage",
      bg: "bg-sage-light/30",
    },
    {
      icon: "🤝",
      title: "Diseñado por especialistas",
      description:
        "Nuestra Skin Bar selecciona y combina fórmulas. Tú solo disfrutas los resultados.",
      accent: "chip-gold",
      bg: "bg-gold-light/30",
    },
    {
      icon: "🌿",
      title: "Originalidad garantizada",
      description:
        "100% cosmética coreana certificada. Importación directa, sin intermediarios.",
      accent: "chip-blush",
      bg: "bg-blush-light/30",
    },
  ];

  return (
    <section className="shell section" aria-labelledby="philosophy-heading">
      <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-up">
        <p className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Nuestra filosofía
        </p>
        <h2 id="philosophy-heading" className="mt-3 font-display text-4xl leading-tight text-plum-ink sm:text-5xl lg:text-6xl">
          Piel sana, rutina simple
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-base text-plum-ink/70 sm:text-lg">
          Creemos que el cuidado de la piel no debe ser complicado. Solo eficaz.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => (
          <article
            key={pillar.title}
            className={`card card-hover group relative overflow-hidden p-6 sm:p-8 text-center animate-fade-up ${pillar.bg}`}
            style={{ transitionDelay: `${100 + i * 80}ms` }}
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl" aria-hidden="true">{pillar.icon}</span>
              <span className={`absolute inset-0 rounded-2xl ${pillar.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
            <h3 className="font-display text-xl text-plum-ink mb-2 group-hover:text-wine transition-colors">
              {pillar.title}
            </h3>
            <p className="text-sm text-plum-ink/70 leading-relaxed">
              {pillar.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
