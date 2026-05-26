import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 mt-12 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
