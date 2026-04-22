"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Award, User } from "lucide-react";

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
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:block w-52 flex-shrink-0">
        <nav className="sticky top-20 border border-[#e0e0e0] bg-white">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3.5 text-sm transition-colors border-b last:border-b-0 border-[#e0e0e0]"
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

        {/* Premium upsell block */}
        <div
          className="mt-4 p-4 border"
          style={{ backgroundColor: "#edf5ff", borderColor: "#a6c8ff" }}
        >
          <p
            className="text-xs font-semibold mb-1 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: "#0043ce" }}
          >
            Premium
          </p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "#525252" }}>
            Desbloqueie todos os cursos e trilhas de IA.
          </p>
          <Link
            href="/assinar"
            className="block w-full text-center py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0353e9]"
            style={{ backgroundColor: "#0f62fe" }}
          >
            Ver planos →
          </Link>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex"
        style={{ backgroundColor: "#fff", borderTop: "1px solid #e0e0e0" }}
      >
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors"
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
