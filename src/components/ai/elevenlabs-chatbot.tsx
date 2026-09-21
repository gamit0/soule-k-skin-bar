"use client";

import { useEffect, useRef, useState } from "react";

export function ElevenLabsChatBot({
  isOpen = true,
  onClose
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load ElevenLabs Conversational AI widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed@latest";
    script.async = true;
    script.type = "module";
    script.onload = () => {
      console.log("[ElevenLabs] Widget script loaded");
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error("[ElevenLabs] Failed to load widget script");
      setError("Failed to load chat widget");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Configure the widget element via its attributes
    const el = containerRef.current;
    if (!el) return;

    const widget = document.createElement("elevenlabs-convai-widget");
    widget.setAttribute("agent-id", "agent_9201m2w5szytf60bnev7em46v1b2");
    widget.setAttribute("variant", "compact");
    widget.setAttribute("placement", "bottom-right");
    widget.style.position = "fixed";
    widget.style.bottom = "24px";
    widget.style.right = "24px";
    widget.style.zIndex = "9999";

    // Wire up callbacks
    (widget as any).onClose = () => {
      console.log("[ElevenLabs] Widget closed");
      onClose?.();
    };

    el.appendChild(widget);
    console.log("[ElevenLabs] Widget element appended to DOM");

    return () => {
      if (el.contains(widget)) {
        el.removeChild(widget);
      }
    };
  }, [isLoaded, onClose]);

  if (!isOpen) return null;

  if (error) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg max-w-xs">
          <p className="text-sm font-medium">No se pudo cargar el chat</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-red-600 underline"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  // Hidden container that holds the widget custom element
  return <div ref={containerRef} aria-hidden="true" />;
}