import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { addresses } from "@/lib/db/schema";
import EditAddressForm from "@/app/account/addresses/new/EditAddressForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAddressPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const customerId = session.user.id as string;

  const address = await db.query.addresses.findFirst({
    where: (a, { eq, and }) => and(eq(a.id, id), eq(a.customerId, customerId)),
  });

  if (!address) redirect("/account/addresses");

  return <EditAddressForm initialData={{
    id: address.id,
    name: address.name,
    recipientName: address.recipientName,
    phone: address.phone,
    street: address.street,
    exteriorNumber: address.exteriorNumber || "",
    interiorNumber: address.interiorNumber,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
  }} />;
}