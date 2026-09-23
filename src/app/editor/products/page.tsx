import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export default async function EditorProductsPage() {
  await requireAdmin(["editor", "super_admin"]);
  redirect("/editor/products");
}