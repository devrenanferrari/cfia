"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Award, User, ChevronRight } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/cursos", label: "Meus cursos", icon: BookOpen },
  { href: "/dashboard/certificados", label: "Certificados", icon: Award },
  { href: "/perfil", label: "Meu perfil", icon: User, exact: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-56 flex-shrink-0">
      <nav className="space-y-0.5 sticky top-24">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
              style={{
                color: active ? "#0052ff" : "#6b7280",
                backgroundColor: active ? "#0052ff0d" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#f9fafb";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#0a0b0d";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
                }
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div
        className="mt-6 rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, #0052ff0d, #7c3aed0d)", border: "1px solid #0052ff14" }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "#0052ff" }}>
          Acesso Premium
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#6b7280" }}>
          Desbloqueie todos os cursos de IA.
        </p>
        <Link
          href="/assinar"
          className="block w-full text-center py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #0052ff, #1a6bff)",
            boxShadow: "0 2px 8px rgba(0,82,255,0.25)",
          }}
        >
          Ver planos
        </Link>
      </div>
    </aside>
  );
}
