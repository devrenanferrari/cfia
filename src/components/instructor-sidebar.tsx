"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/instrutor", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/instrutor/cursos", label: "Meus cursos", icon: BookOpen, exact: false },
  { href: "/instrutor/cursos/novo", label: "Criar curso", icon: PlusCircle, exact: true },
];

export function InstructorSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    // Para /instrutor/cursos, ativo em qualquer sub-rota EXCETO /novo
    if (href === "/instrutor/cursos") {
      return pathname.startsWith("/instrutor/cursos") && !pathname.endsWith("/novo");
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:block w-52 flex-shrink-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Área do Instrutor
      </p>
      <nav className="space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "text-[#0052ff] bg-[#0052ff0f]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
