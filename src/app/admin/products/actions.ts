"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function createProduct(formData: FormData) {
  await requireAdmin(["super_admin", "editor"]);

  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await db.insert(products).values({
    name,
    slug,
    brand: (formData.get("brand") as string) || "Soule Lab",
    price: (formData.get("price") as string) || "0",
    shortDescription: (formData.get("shortDescription") as string) || "",
    routineStep: (formData.get("routineStep") as
      | "cleanser"
      | "serum"
      | "moisturizer"
      | "sunscreen"
      | "treatment") ?? "serum",
    stock: Number(formData.get("stock") ?? 0),
    isMock: false,
  });

  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin(["super_admin", "editor"]);
  await db.update(products).set({ active }).where(eq(products.id, id));
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin(["super_admin"]);
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
}
