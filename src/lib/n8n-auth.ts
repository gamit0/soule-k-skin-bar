/**
 * n8n Authentication Guard
 *
 * Protects server-to-server endpoints used by n8n workflows.
 * Uses a shared secret API key that is ONLY configured on:
 * - n8n (environment variable)
 * - Server (environment variable)
 *
 * NEVER exposed to the browser (no NEXT_PUBLIC_ prefix).
 */

export function verifyN8nAuth(request: Request): boolean {
  const apiKey = process.env.N8N_API_KEY;

  if (!apiKey) {
    console.error("[n8n-auth] N8N_API_KEY not configured on server");
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(token, apiKey);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function createN8nUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "No autorizado. API key de n8n requerida." }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}