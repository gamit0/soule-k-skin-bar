import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export default async function SupportCustomersPage() {
  await requireAdmin(["support", "super_admin", "editor"]);
  redirect("/support/customers");
}