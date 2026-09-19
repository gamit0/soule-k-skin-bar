"use client";

import { useState, useEffect } from "react";
import { ElevenLabsChatBot } from "@/components/ai/elevenlabs-chatbot";
import { WhatsAppService } from "@/server/services/whatsapp-service";

type ConsultationStep = "initial" | "selection" | "web_bot";

export function ConsultationSection({
  cocktailName,
  products = [],
  total = 0
}: {
  cocktailName: string;
  products?: { name: string; price: string | number }[];
  total?: string | number;
}) {
  const [step, setStep] = useState<ConsultationStep>("initial");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (step === "web_bot") {
      const timer = setTimeout(() => {
        setIsChatOpen(true);
        setStep("initial"); // Reset to initial so it can be used again
      }, 3000); // Simulate "Connecting..." for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleWhatsAppClick = () => {
    const message = WhatsAppService.generateOrderMessage({
      shotName: cocktailName,
      products,
      total,
    });
    // Si NEXT_PUBLIC_WHATSAPP_NUMBER no está configurada, generateOrderMessage
    // devuelve null → no abrimos una ventana a wa.me/undefined.
    if (!message) return;
    window.open(message, "_blank");
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-plum-ink/5 p-6 transition-all duration-300">
        {step === "initial" && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-plum-ink">
              ¿No estás segura de todo?
            </h3>
            <p className="mt-2 text-sm text-plum-ink/60">
              Te ayudamos a entender exactamente por qué estos productos son para ti.
            </p>
            <button
              type="button"
              onClick={() => setStep("selection")}
              className="mt-6 rounded-full bg-wine px-6 py-3 text-ivory transition-all hover:bg-wine-dark hover:shadow-md"
            >
              Descubre qué productos son para ti
            </button>
          </div>
        )}

        {step === "selection" && (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-[family-name:var(--font-display)] text-xl text-plum-ink">
              Elige cómo quieres consultar
            </h3>
            <div className="mt-6 grid w-full gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 rounded-2xl border border-plum-ink/10 bg-white px-6 py-4 transition-all hover:border-wine hover:text-wine"
              >
                <span>🟢</span> Asistente WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setStep("web_bot")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-plum-ink/10 bg-white px-6 py-4 transition-all hover:border-wine hover:text-wine"
              >
                <span>🌐</span> Asistente Web
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep("initial")}
              className="mt-6 text-xs text-plum-ink/40 underline underline-offset-4 hover:text-plum-ink"
            >
              Volver
            </button>
          </div>
        )}

        {step === "web_bot" && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wine text-ivory animate-bounce">
              ✨
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-plum-ink">
              Conectando con nuestra especialista...
            </h3>
            <p className="mt-2 text-sm text-plum-ink/60">
              Estamos analizando tu perfil para darte la mejor recomendación.
            </p>
            <div className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-plum-ink/10">
              <div className="h-full bg-wine animate-progress-loading" style={{ width: "100%" }} />
            </div>
            <button
              type="button"
              onClick={() => setStep("selection")}
              className="mt-8 text-xs text-plum-ink/40 underline underline-offset-4 hover:text-plum-ink"
            >
              Cambiar método de consulta
            </button>
          </div>
        )}
      </div>

      <ElevenLabsChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}
