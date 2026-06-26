import { getSession } from "@/lib/auth";
import { AdminSOLayout } from "@/components/layout/AdminSOLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <AdminSOLayout user={session}>{children}</AdminSOLayout>;
}
