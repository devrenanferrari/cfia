import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, Users, BookOpen, UserCheck, Megaphone } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/alunos", label: "Alunos", icon: Users },
  { href: "/admin/instrutores", label: "Instrutores", icon: UserCheck },
  { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
  { href: "/admin/banners", label: "Banners", icon: Megaphone },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f7f8fa" }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r"
        style={{ backgroundColor: "#0a0b0d", borderColor: "#ffffff12" }}
      >
        <div className="p-6 border-b" style={{ borderColor: "#ffffff12" }}>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GraduationCap className="h-6 w-6" style={{ color: "#578bfa" }} />
            <span style={{ color: "#578bfa" }}>cfia</span>
            <span className="text-xs ml-1 px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#0052ff22", color: "#578bfa" }}>
              admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/10"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "#ffffff12" }}>
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-semibold text-white/80">{session.user?.name}</p>
            <p className="text-xs text-white/40">{session.user?.email}</p>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
