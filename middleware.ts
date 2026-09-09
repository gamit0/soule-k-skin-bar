import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting simple en memoria por IP para rutas /api/*. Suficiente
// para un solo servidor; si se despliega en Vercel con múltiples
// instancias serverless, cada instancia tiene su propio mapa — para rate
// limiting robusto a escala hay que mover esto a Upstash Redis o similar
// (ver DOC-PENDIENTES.md).
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const hits = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers de seguridad básicos en toda respuesta.
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || now > entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      entry.count += 1;
      if (entry.count > MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes, intenta más tarde." },
          { status: 429 },
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
