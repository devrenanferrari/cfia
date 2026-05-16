"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BookOpen, Heart, LayoutDashboard, User } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/cursos", label: "Meus cursos", icon: BookOpen },
  { href: "/dashboard/certificados", label: "Certificados", icon: Award },
  { href: "/perfil", label: "Perfil", icon: User, exact: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-52 flex-shrink-0 md:block">
        <nav className="sticky top-20 border border-[#e0e0e0] bg-white">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-3.5 text-sm transition-colors last:border-b-0"
                style={{
                  color: active ? "#161616" : "#525252",
                  fontWeight: active ? 600 : 400,
                  backgroundColor: active ? "#f4f4f4" : "#fff",
                  borderLeft: active ? "3px solid #0f62fe" : "3px solid transparent",
                }}
              >
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: active ? "#0f62fe" : "#8d8d8d" }} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border p-4" style={{ backgroundColor: "#edf5ff", borderColor: "#a6c8ff" }}>
          <Heart className="mb-3 h-4 w-4" style={{ color: "#0f62fe" }} />
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: "#0043ce" }}
          >
            Projeto gratuito
          </p>
          <p className="mb-4 text-xs leading-relaxed" style={{ color: "#525252" }}>
            Ajude o CFIA a manter cursos livres e gratuitos.
          </p>
          <Link
            href="/apoie"
            className="block w-full py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-[#0353e9]"
            style={{ backgroundColor: "#0f62fe" }}
          >
            Apoiar projeto →
          </Link>
        </div>
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
        style={{ backgroundColor: "#fff", borderTop: "1px solid #e0e0e0" }}
      >
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors"
              style={{
                color: active ? "#0f62fe" : "#8d8d8d",
                fontWeight: active ? 600 : 400,
                borderTop: active ? "2px solid #0f62fe" : "2px solid transparent",
                marginTop: -1,
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
