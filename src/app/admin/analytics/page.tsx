import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { analyticsEvents } from "@/lib/db/schema";

const FUNNEL_STEPS = [
  { type: "quiz_started", label: "Iniciaron el quiz" },
  { type: "quiz_completed", label: "Terminaron el quiz" },
  { type: "recommendation_received", label: "Recibieron recomendación" },
  { type: "add_to_cart", label: "Agregaron al carrito" },
  { type: "purchase_completed", label: "Compraron" },
] as const;

export default async function AdminAnalyticsPage() {
  const counts = await db
    .select({
      type: analyticsEvents.type,
      count: sql<number>`count(distinct ${analyticsEvents.sessionId})`,
    })
    .from(analyticsEvents)
    .groupBy(analyticsEvents.type);

  const countByType = Object.fromEntries(counts.map((c) => [c.type, c.count]));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-plum-ink">
        Funnel
      </h1>
      <p className="mt-2 text-sm text-plum-ink/50">
        Sesiones únicas por evento (no hay eventos aún hasta que el sitio
        tenga tráfico real).
      </p>

      <ul className="mt-8 space-y-3">
        {FUNNEL_STEPS.map((step) => (
          <li
            key={step.type}
            className="flex items-center justify-between rounded-lg border border-plum-ink/10 px-4 py-3"
          >
            <span className="text-plum-ink">{step.label}</span>
            <span className="text-lg text-wine">
              {countByType[step.type] ?? 0}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
