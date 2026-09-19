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
  const initAttempted = useRef(false);

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    // Load ElevenLabs Conversational AI widget
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed@latest";
    script.async = true;
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
    if (!isLoaded || initAttempted.current) return;

    // Initialize the widget when loaded - try without container first
    const initWidget = () => {
      const widget = (window as any).ElevenLabsConvaiWidget;
      if (!widget) {
        console.log("[ElevenLabs] Widget not ready yet");
        return false;
      }

      try {
        console.log("[ElevenLabs] Initializing widget with agent:", "agent_9201m2w5szytf60bnev7em46v1b2");

        // Try without container first (widget creates its own floating button)
        widget.init({
          agentId: "agent_9201m2w5szytf60bnev7em46v1b2",
          onClose: () => {
            console.log("[ElevenLabs] Widget closed");
            onClose?.();
          },
          onOpen: () => {
            console.log("[ElevenLabs] Widget opened");
          },
          onError: (err: any) => {
            console.error("[ElevenLabs] Widget error:", err);
            setError(err?.message || "Chat widget error");
          },
        });

        initAttempted.current = true;
        console.log("[ElevenLabs] Widget initialized successfully");
        return true;
      } catch (err) {
        console.error("[ElevenLabs] Init error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize chat");
        return false;
      }
    };

    // Try to initialize immediately
    if (!initWidget()) {
      // Retry every 100ms for up to 10 seconds
      const interval = setInterval(() => {
        if (initWidget() || initAttempted.current) {
          clearInterval(interval);
        }
      }, 100);

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!initAttempted.current) {
          setError("Widget initialization timeout");
        }
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
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

  // Widget renders its own floating button - no container needed
  return null;
}