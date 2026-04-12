import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { BookOpen, LayoutDashboard, PlusCircle, BarChart } from "lucide-react";

const sidebarLinks = [
  { href: "/instrutor", label: "Painel", icon: LayoutDashboard },
  { href: "/instrutor/cursos", label: "Meus cursos", icon: BookOpen },
  { href: "/instrutor/cursos/novo", label: "Criar curso", icon: PlusCircle },
  { href: "/instrutor/analytics", label: "Analytics", icon: BarChart },
];

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/entrar");
  if (session.user.role === "STUDENT") redirect("/dashboard");

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8 flex-1">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Área do Instrutor
          </p>
          <nav className="space-y-1">
            {sidebarLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
