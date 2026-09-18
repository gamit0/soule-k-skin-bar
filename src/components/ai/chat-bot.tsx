"use client";

import { useState, useEffect, useRef } from "react";
import { track } from "@/lib/track";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatBot({
  isOpen,
  onClose,
  cocktailName
}: {
  isOpen: boolean;
  onClose: () => void;
  cocktailName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `¡Hola! Soy Soule AI. He visto que tu cocktail recomendado es el ${cocktailName}. ¿Tienes alguna duda sobre los productos o quieres saber más sobre cómo aplicarlos en tu rutina?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function resetSession() {
    setMessages([
      {
        role: "assistant",
        content: `¡Hola! Soy Soule AI. He visto que tu cocktail recomendado es el ${cocktailName}. ¿Tienes alguna duda sobre los productos o quieres saber más sobre cómo aplicarlos en tu rutina?`
      }
    ]);
    onClose();
  }

  function resetTimer() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      resetSession();
    }, 10 * 60 * 1000); // 10 minutos
  }

  useEffect(() => {
    if (isOpen) {
      resetTimer();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    resetTimer();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Lo siento, tuve un problema técnico. ¿Intentamos de nuevo?" }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "No pude conectar con el servidor. Por favor, verifica tu conexión." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-plum-ink/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full max-w-md h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border border-plum-ink/10">

        {/* Header */}
        <div className="bg-white border-b border-plum-ink/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-wine flex items-center justify-center text-ivory text-lg shadow-inner">
              ✨
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-plum-ink font-semibold">Soule AI</h3>
              <p className="text-[10px] text-plum-ink/40 uppercase tracking-wider">Asistente de Piel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-plum-ink/5 transition-colors text-plum-ink/40 hover:text-plum-ink"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blush/5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-wine text-ivory rounded-tr-none"
                    : "bg-white text-plum-ink border border-plum-ink/10 rounded-tl-none shadow-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-plum-ink/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-plum-ink/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-plum-ink/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-plum-ink/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-4 bg-white border-t border-plum-ink/10 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu duda aquí..."
            className="flex-1 bg-plum-ink/5 border border-plum-ink/10 rounded-full px-4 py-2 text-sm text-plum-ink focus:outline-none focus:border-wine transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-wine text-ivory transition-all hover:bg-wine-dark active:scale-90 disabled:opacity-50 disabled:grayscale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
