"use server";

import { db } from "@/lib/db/client";
import { auditLogs, type NewAuditLog } from "@/lib/db/schema";

export type ActorType = "admin" | "customer" | "guest" | "system";
export type ActorRole = "super_admin" | "editor" | "support" | "customer" | null;

export interface AuditLogInput {
  actorType: ActorType;
  actorId?: string;
  actorEmail?: string;
  actorRole?: ActorRole;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry.
 * Fire-and-forget: failures don't block the main operation.
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      actorType: input.actorType,
      actorId: input.actorId,
      actorEmail: input.actorEmail,
      actorRole: input.actorRole,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
      ip: input.ip,
      userAgent: input.userAgent,
    } as NewAuditLog);
  } catch (err) {
    // Audit logging should never break the main flow
    console.error("[audit-log] Failed to write audit log:", err);
  }
}

/**
 * Server-only helper to get client IP and User-Agent from request headers.
 * Usage: const { ip, userAgent } = await getRequestContext(request);
 */
export async function getRequestContext(request: Request): Promise<{ ip: string | undefined; userAgent: string | undefined }> {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipFromForwarded = forwarded ? forwarded.split(",")[0]?.trim() : undefined;
  const ip = ipFromForwarded ?? realIp ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;
  return { ip, userAgent };
}