"use client";

import { useEffect } from "react";

export function ExternalChatBot() {
  useEffect(() => {
    // Definimos la función de carga tal como está en el script proporcionado
    (window as any).msbLoadChat = () => {
      const script = document.createElement('script');
      script.src = 'https://mavibot.ai/js/chatbot.js?v=1';
      script.async = true;

      script.addEventListener('load', () => {
        if ((window as any).ChatBotPro) {
          (window as any).ChatBotPro.init({
            guid: '797c64287651e6de3c7eb66dddd85d'
          });
        }
      });

      document.head.append(script);
    };

    // Ejecutamos la carga siguiendo la lógica de prioridades del script original
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        (window as any).msbLoadChat();
      }, { timeout: 4000 });
    } else {
      setTimeout(() => {
        (window as any).msbLoadChat();
      }, 2000);
    }
  }, []);

  // Este componente no renderiza nada visualmente porque el script del chatbot
  // se encarga de inyectar su propio widget en el DOM.
  return null;
}
