"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { skinTypeEnum, concernEnum, routineStepEnum, routineUsageEnum } from "@/lib/db/schema";
import { createAuditLog } from "@/lib/audit-log";

export async function createProduct(formData: FormData) {
  const admin = await requireAdmin(["super_admin", "editor"]);
  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/̀-ͯ/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const routineStep = ((formData.get("routineStep") as string) || "serum") as (typeof routineStepEnum.enumValues)[number];
  const usage = ((formData.get("usage") as string) || "BOTH") as (typeof routineUsageEnum.enumValues)[number];
  await db.insert(products).values({
    name,
    slug,
    brand: (formData.get("brand") as string) || "Soule Lab",
    price: (formData.get("price") as string) || "0",
    shortDescription: (formData.get("shortDescription") as string) || "",
    routineStep,
    usage,
    stock: Number(formData.get("stock") ?? 0),
    isMock: false,
    skinTypes: formData.getAll("skinTypes") as (typeof skinTypeEnum.enumValues)[number][],
    concerns: formData.getAll("concerns") as (typeof concernEnum.enumValues)[number][],
  });
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "product.create",
    entityType: "product",
    metadata: { name, slug },
  });
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const admin = await requireAdmin(["super_admin", "editor"]);
  const routineStep = ((formData.get("routineStep") as string) || "serum") as (typeof routineStepEnum.enumValues)[number];
  const usage = ((formData.get("usage") as string) || "BOTH") as (typeof routineUsageEnum.enumValues)[number];
  await db
    .update(products)
    .set({
      name: formData.get("name") as string,
      brand: formData.get("brand") as string,
      price: formData.get("price") as string,
      shortDescription: formData.get("shortDescription") as string,
      description: formData.get("description") as string,
      routineStep,
      usage,
      stock: Number(formData.get("stock") ?? 0),
      active: formData.get("active") === "on",
      skinTypes: formData.getAll("skinTypes") as (typeof skinTypeEnum.enumValues)[number][],
      concerns: formData.getAll("concerns") as (typeof concernEnum.enumValues)[number][],
    })
    .where(eq(products.id, id));
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "product.update",
    entityType: "product",
    entityId: id,
    metadata: { name: formData.get("name") as string },
  });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, active: boolean) {
  const admin = await requireAdmin(["super_admin", "editor"]);
  await db.update(products).set({ active }).where(eq(products.id, id));
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "product.toggle_active",
    entityType: "product",
    entityId: id,
    metadata: { active },
  });
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin(["super_admin"]);
  await db.delete(products).where(eq(products.id, id));
  await createAuditLog({
    actorType: "admin",
    actorId: admin.id,
    actorEmail: admin.email ?? undefined,
    actorRole: admin.role as any,
    action: "product.delete",
    entityType: "product",
    entityId: id,
  });
  revalidatePath("/admin/products");
}
