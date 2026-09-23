"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { shots } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { skinTypeEnum, concernEnum } from "@/lib/db/schema";
import { createAuditLog } from "@/lib/audit-log";

export async function createShot(formData: FormData) {
  const admin = await requireAdmin(["super_admin", "editor"]);
  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await db.insert(shots).values({
    name,
    slug,
    menuTitle: (formData.get("menuTitle") as string) || name,
    subtitle: (formData.get("subtitle") as string) || "",
    category: (formData.get("category") as string) || "Personalized",
    description: (formData.get("description") as string) || "",
    icon: (formData.get("icon") as string) || "✨",
    mood: (formData.get("mood") as string) || "Glow",
    concerns: formData.getAll("concerns") as (typeof concernEnum.enumValues)[number][],
    skinTypes: formData.getAll("skinTypes") as (typeof skinTypeEnum.enumValues)[number][],
    active: true,
  });

  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "shot.create",
    entityType: "shot",
    metadata: { name, slug },
  });

  revalidatePath("/admin/shots");
}

export async function updateShot(id: string, formData: FormData) {
  const admin = await requireAdmin(["super_admin", "editor"]);

  await db
    .update(shots)
    .set({
      name: formData.get("name") as string,
      menuTitle: formData.get("menuTitle") as string,
      subtitle: formData.get("subtitle") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      mood: formData.get("mood") as string,
      concerns: formData.getAll("concerns") as (typeof concernEnum.enumValues)[number][],
      skinTypes: formData.getAll("skinTypes") as (typeof skinTypeEnum.enumValues)[number][],
      active: formData.get("active") === "on",
    })
    .where(eq(shots.id, id));

  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "shot.update",
    entityType: "shot",
    entityId: id,
    metadata: { name: formData.get("name") as string },
  });

  revalidatePath("/admin/shots");
}

export async function toggleShotActive(id: string, active: boolean) {
  const admin = await requireAdmin(["super_admin", "editor"]);
  await db.update(shots).set({ active }).where(eq(shots.id, id));

  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "shot.toggle_active",
    entityType: "shot",
    entityId: id,
    metadata: { active },
  });

  revalidatePath("/admin/shots");
}

export async function deleteShot(id: string) {
  const admin = await requireAdmin(["super_admin"]);
  await db.delete(shots).where(eq(shots.id, id));

  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "shot.delete",
    entityType: "shot",
    entityId: id,
  });

  revalidatePath("/admin/shots");
}
