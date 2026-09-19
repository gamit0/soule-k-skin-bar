"use client";

import { useEffect, useRef, useState } from "react";

export function ElevenLabsChatBot({
  isOpen,
  onClose
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    // Load ElevenLabs Conversational AI widget
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Initialize the widget when loaded
    const initWidget = () => {
      if ((window as any).ElevenLabsConvaiWidget) {
        (window as any).ElevenLabsConvaiWidget.init({
          agentId: "agent_9201m2w5szytf60bnev7em46v1b2",
          container: containerRef.current!,
          onClose: () => onClose?.(),
          onOpen: () => {},
        });
      }
    };

    // Try to initialize, retry if needed
    initWidget();
    const interval = setInterval(() => {
      if ((window as any).ElevenLabsConvaiWidget) {
        initWidget();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoaded, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} id="elevenlabs-chatbot-container" />
  );
}