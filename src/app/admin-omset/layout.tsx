import { getSession } from "@/lib/auth";
import { AdminOmsetLayout } from "@/components/layout/AdminOmsetLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <AdminOmsetLayout user={session}>{children}</AdminOmsetLayout>;
}
