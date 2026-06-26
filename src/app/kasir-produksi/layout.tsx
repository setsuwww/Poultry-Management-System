import { getSession } from "@/lib/auth";
import { KasirLayout } from "@/components/layout/KasirLayout";

export default async function KasirProduksiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return <KasirLayout user={session}>{children}</KasirLayout>;
}
