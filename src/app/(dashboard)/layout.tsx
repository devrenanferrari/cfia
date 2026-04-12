import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { BookOpen, LayoutDashboard, Award, User } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/cursos", label: "Meus cursos", icon: BookOpen },
  { href: "/dashboard/certificados", label: "Certificados", icon: Award },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/entrar?callbackUrl=/dashboard");

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8 flex-1">
        <aside className="hidden md:block w-56 flex-shrink-0">
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
