import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";

export default function EspecialistaPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "521234567890"; // Fallback
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola Soule, me gustaria recibir asesoria personalizada de una especialista sobre mi rutina de skincare.")}`;

  return (
    <>
      <Header />
      <main className="shell section min-h-screen py-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" aria-hidden="true" />
            Asesoria Premium
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-plum-ink mb-6 leading-tight">
            Tu piel es unica, <br /> tu rutina tambien debe serlo.
          </h1>
          <p className="text-lg text-plum-ink/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            No todas las pieles reaccionan igual. Nuestras especialistas en K-Beauty te ayudaran a optimizar tu Cocktail de productos, resolver dudas sobre activos y ajustar tu rutina segun la estacion del ano.
          </p>

          <div className="grid gap-8 sm:grid-cols-3 mb-16">
            {[
              { title: "Analisis de Activos", desc: "Entiende que ingredientes funcionan mejor para ti." },
              { title: "Ajuste de Rutina", desc: "Adaptamos tu Shot segun los cambios de tu piel." },
              { title: "Guia de Uso", desc: "Aprende la tecnica coreana de aplicacion para mejores resultados." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-blush/10 border border-blush/30 text-center">
                <h3 className="font-display text-lg text-plum-ink mb-2">{item.title}</h3>
                <p className="text-sm text-plum-ink/60">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg bg-wine text-ivory px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg flex items-center gap-3"
            >
              <span>Hablar con una Especialista ahora</span>
            </a>
            <p className="text-xs text-plum-ink/40">
              Respuesta promedio: menos de 4 horas en horario laboral.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
