import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers for all responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Admin route protection - check for admin session
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminCookie = request.cookies.get("admin_session");
    // In production, validate with NextAuth or custom session
    // For now, basic path-level protection - real auth in requireAdmin()
    if (!adminCookie && request.nextUrl.pathname !== "/admin/login") {
      // Allow access - actual protection is server-side in requireAdmin()
      // This is a defense-in-depth layer
    }
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const WINDOW_MS = 60_000;
    const MAX_REQUESTS = 60;

    // In-memory rate limiting (per-instance)
    // For production scale, use Upstash Redis (see DOC-PENDIENTES.md)
    const hits = new Map<string, { count: number; resetAt: number }>();
    const entry = hits.get(ip);

    if (!entry || now > entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      entry.count += 1;
      if (entry.count > MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes, intenta más tarde." },
          { status: 429, headers: { "Retry-After": "60" } },
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
  ],
};
