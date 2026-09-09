"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"] as const;

export async function updateOrderStatus(id: string, status: (typeof STATUSES)[number]) {
  await requireAdmin(["super_admin", "support"]);
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
}
