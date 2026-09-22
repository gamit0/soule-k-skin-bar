"use client";

import { useState, useEffect } from "react";
import { N8nChatBot } from "./n8n-chatbot";

/**
 * Wrapper that manages the open/close state for N8nChatBot.
 * This isolates the local state from the root layout Server Component.
 */
function ClientChatWrapper() {
  const [isOpen, setIsOpen] = useState(true);
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