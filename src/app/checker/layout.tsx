import { getSession } from "@/lib/auth";
import { CheckerLayout } from "@/components/layout/CheckerLayout";

export default async function CheckerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <CheckerLayout user={session}>{children}</CheckerLayout>;
}
