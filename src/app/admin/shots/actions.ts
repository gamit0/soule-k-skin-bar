"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { shots } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { skinTypeEnum, concernEnum } from "@/lib/db/schema";

export async function createShot(formData: FormData) {
  await requireAdmin(["super_admin", "editor"]);

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

  revalidatePath("/admin/shots");
}

export async function updateShot(id: string, formData: FormData) {
  await requireAdmin(["super_admin", "editor"]);

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

  revalidatePath("/admin/shots");
}

export async function toggleShotActive(id: string, active: boolean) {
  await requireAdmin(["super_admin", "editor"]);
  await db.update(shots).set({ active }).where(eq(shots.id, id));
  revalidatePath("/admin/shots");
}

export async function deleteShot(id: string) {
  await requireAdmin(["super_admin"]);
  await db.delete(shots).where(eq(shots.id, id));
  revalidatePath("/admin/shots");
}