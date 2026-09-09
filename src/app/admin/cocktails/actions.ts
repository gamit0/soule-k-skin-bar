"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { cocktails } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function createCocktail(formData: FormData) {
  await requireAdmin(["super_admin", "editor"]);

  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await db.insert(cocktails).values({
    name,
    slug,
    description: (formData.get("description") as string) || "",
    shortDescription: (formData.get("shortDescription") as string) || "",
  });

  revalidatePath("/admin/cocktails");
}
