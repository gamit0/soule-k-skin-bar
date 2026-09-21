"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function N8nChatBot({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Webhook URL - configurable via env var for different environments
  const WEBHOOK_URL =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
    "https://gamuss.app.n8n.cloud/webhook/96b05764-937e-4878-81d9-67a9401b9548/chat";

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "¡Hola! 👋 Soy Soulk bot, ¿en qué puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Encontrar tu Shot de skincare ideal\n• Resolver dudas sobre productos\n• Guiarte en tu rutina AM/PM\n• Informarte sobre envíos y pedidos",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: "chat-" + Date.now(), // Simple session tracking
        }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      // n8n typically returns the response in different formats
      // Handle common response structures
      let botResponse = "";

      if (typeof data === "string") {
        botResponse = data;
      } else if (data?.output || data?.response || data?.text || data?.message) {
        botResponse = data.output || data.response || data.text || data.message;
      } else if (data?.data?.output) {
        botResponse = data.data.output;
      } else if (Array.isArray(data) && data.length > 0) {
        botResponse = data[0]?.output || data[0]?.response || JSON.stringify(data[0]);
      } else {
        botResponse = JSON.stringify(data);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("[N8nChatBot] Error:", err);
      setError("No se pudo conectar con el asistente. Intenta de nuevo más tarde.");

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, tuve un problema al conectar. 😔\n\nPuedes intentarlo de nuevo o contactarnos por WhatsApp para ayuda personalizada.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 w-full max-w-sm md:max-w-md"
    >
      {/* Chat Window */}
      <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-plum-ink/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-plum-ink text-ivory border-b border-plum-ink/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wine/20 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <p className="font-medium text-sm">Soulk Bot</p>
              <p className="text-xs text-ivory/70">Especialista en Skincare</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ivory/70 hover:text-ivory hover:bg-white/10 transition-colors"
            aria-label="Cerrar chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-wine text-ivory rounded-br-md"
                    : "bg-plum-ink/5 text-plum-ink rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-50 mt-1 block text-right">
                  {msg.timestamp.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-plum-ink/5 text-plum-ink px-4 py-2.5 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-t border-red-100 px-4 py-2">
            <p className="text-xs text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-plum-ink/10 p-3 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              rows={1}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm bg-plum-ink/5 border border-plum-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine/20 focus:border-wine resize-none disabled:opacity-50"
              aria-label="Mensaje"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-wine text-ivory rounded-xl hover:bg-wine-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              aria-label="Enviar mensaje"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-plum-ink/40 text-center mt-2">
            Presiona Enter para enviar • Shift+Enter para nueva línea
          </p>
        </div>
      </div>

      {/* Floating trigger button (when chat is closed) - handled by parent */}
    </div>
  );
}