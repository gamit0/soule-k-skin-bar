import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { db } from "@/lib/db/client";
import { analyticsEvents } from "@/lib/db/schema";
import { WhatsAppNotificationProvider } from "@/server/providers/whatsapp-notification-provider";

export default async function ContactRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ context?: string }>;
}) {
  const { context } = await searchParams;
  const provider = new WhatsAppNotificationProvider();

  const text = context
    ? `Hola, hice el Skin Quiz y mi resultado fue ${context}. Quiero hablar con una especialista.`
    : "Hola, quiero hablar con una especialista de Soule K Skin Bar.";

  await db
    .insert(analyticsEvents)
    .values({ type: "whatsapp_click", sessionId: randomUUID(), metadata: { context } })
    .catch(() => {});

  const link = provider.buildContactLink({ to: "", text });
  redirect(link);
}
