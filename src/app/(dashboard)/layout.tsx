import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/dashboard");

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 flex gap-8 pb-24 md:pb-8">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
