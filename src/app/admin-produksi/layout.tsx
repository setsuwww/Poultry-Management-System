import { getSession } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";

export default async function AdminProduksiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return <AppLayout user={session}>{children}</AppLayout>;
}
