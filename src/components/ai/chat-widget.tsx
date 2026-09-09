"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((m) => [...m, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply ?? data.error },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-wine px-5 py-3 text-sm text-ivory shadow-lg"
      >
        🍸 Soule AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 flex h-96 w-80 flex-col rounded-2xl border border-plum-ink/10 bg-ivory shadow-xl">
      <div className="flex items-center justify-between border-b border-plum-ink/10 px-4 py-3">
        <p className="text-sm text-plum-ink">Soule AI</p>
        <button onClick={() => setOpen(false)} className="text-plum-ink/40">
          ✕
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {messages.length === 0 && (
          <p className="text-plum-ink/40">
            Cuéntame qué necesita tu piel y te recomiendo un cocktail.
          </p>
        )}
        {messages.map((m, i) => (
          <p
            key={i}
            className={m.role === "user" ? "text-plum-ink" : "text-wine"}
          >
            {m.text}
          </p>
        ))}
        {loading && <p className="text-plum-ink/40">Escribiendo…</p>}
      </div>
      <div className="flex gap-2 border-t border-plum-ink/10 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escribe aquí…"
          className="flex-1 rounded-full border border-plum-ink/15 px-3 py-2 text-sm"
        />
        <button onClick={send} className="text-wine">
          Enviar
        </button>
      </div>
    </div>
  );
}
