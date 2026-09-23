-- Audit trail for admin/editor/support actions and customer-facing events.
-- Deterministic, append-only log of who did what and when.
CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "actor_type" varchar(20) NOT NULL, -- "admin" | "customer" | "guest" | "system"
    "actor_id" varchar(200),           -- admin_users.id | customers.id | null
    "actor_email" varchar(200),
    "actor_role" varchar(20),          -- super_admin | editor | support | customer | null
    "action" varchar(120) NOT NULL,    -- e.g. "product.create", "order.status_changed"
    "entity_type" varchar(80),         -- e.g. "product", "order", "shot"
    "entity_id" varchar(200),
    "metadata" jsonb,
    "ip" varchar(45),
    "user_agent" varchar(512),
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_logs_actor_type_idx" ON "audit_logs" ("actor_type");
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" ("action");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs" ("entity_type", "entity_id");