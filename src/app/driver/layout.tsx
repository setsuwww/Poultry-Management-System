import { getSession } from "@/lib/auth";
import { DriverLayout } from "@/components/layout/DriverLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <DriverLayout user={session}>{children}</DriverLayout>;
}
