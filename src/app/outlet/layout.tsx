import { getSession } from "@/lib/auth";
import { OutletLayout } from "@/components/layout/OutletLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <OutletLayout user={session}>{children}</OutletLayout>;
}
