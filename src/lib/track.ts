"use client";

const SESSION_KEY = "soule-k-session-id";

function getSessionId() {
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(
  type:
    | "page_view"
    | "quiz_started"
    | "quiz_completed"
    | "recommendation_received"
    | "shot_recommended"
    | "product_viewed"
    | "shot_viewed"
    | "add_to_cart"
    | "added_to_cart"
    | "checkout_started"
    | "purchase_completed"
    | "whatsapp_click"
    | "whatsapp_clicked"
    | "instagram_click"
    | "tiktok_click",
  metadata: Record<string, unknown> = {},
) {
  const sessionId = getSessionId();
  // fire-and-forget, nunca bloquea la UI
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, sessionId, metadata }),
  }).catch(() => {});
}
