import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}