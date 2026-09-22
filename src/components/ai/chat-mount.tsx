"use client";

import { useState, useEffect } from "react";
import { N8nChatBot } from "./n8n-chatbot";

/**
 * Wrapper that manages the open/close state for N8nChatBot.
 * Shows a floating trigger button when chat is closed.
 */
function ClientChatWrapper() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-wine text-ivory shadow-xl hover:bg-wine-dark hover:scale-105 transition-all duration-300 animate-bounce-subtle"
        aria-label="Abrir chat de Soule K"
        type="button"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blush px-1.5 text-[0.6rem] font-bold text-ivory shadow-sm animate-ping">
          !
        </span>
      </button>
    );
  }

  return (
    <N8nChatBot
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}

/**
 * Hydration guard: returns null during SSR to avoid hydration mismatches
 * from local state in N8nChatBot (messages, input, loading, etc.).
 * After client hydration, mounts the actual chat widget.
 */
export function ChatMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ClientChatWrapper />;
}