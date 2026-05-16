"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { NotificationBell } from "@/components/community/notification-bell";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Nav para quem está logado — só o que faz sentido
  const authLinks = [
    { href: "/dashboard", label: "Início" },
    { href: "/cursos", label: "Cursos" },
    { href: "/comunidade", label: "Comunidade" },
    { href: "/trilhas", label: "Trilhas" },
    ...(isInstructor ? [{ href: "/instrutor", label: "Instrutor" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  // Nav pública — marketing + descoberta
  const publicLinks = [
    { href: "/trilhas", label: "Trilhas" },
    { href: "/cursos", label: "Cursos" },
    { href: "/comunidade", label: "Comunidade" },
    { href: "/laboratorio", label: "Laboratório" },
    { href: "/apoie", label: "Apoie" },
    { href: "/professores", label: "Professores" },
    { href: "/sobre", label: "Sobre" },
  ];

  const navLinks = session ? authLinks : publicLinks;

  return (
    <>
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#161616" }}>
      <div className="mx-auto max-w-[1584px] px-4 md:px-8">
        <div className="flex h-12 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex shrink-0 items-center gap-2 text-lg font-semibold text-white"
          >
            CFIA
          </Link>

          {/* Nav central */}
          <nav className="hidden h-full items-center md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex h-full items-center px-4 text-sm transition-colors"
                  style={{
                    color: active ? "#ffffff" : "#8d8d8d",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 h-[3px] w-full"
                      style={{ backgroundColor: "#0f62fe" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Direita */}
          <div className="flex h-full items-center gap-1">
            <button
              className="hidden h-12 w-10 items-center justify-center transition-colors hover:text-white sm:flex"
              style={{ color: "#8d8d8d", backgroundColor: "transparent" }}
              onClick={() => router.push("/cursos")}
              aria-label="Buscar cursos"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {session && <NotificationBell />}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 outline-none focus-visible:ring-2 focus-visible:ring-[#0f62fe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616] rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? ""} />
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                    >
                      {initials ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end" sideOffset={10}>
                  {/* Header do dropdown */}
                  <div className="px-3 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image ?? undefined} />
                        <AvatarFallback
                          className="text-sm font-bold"
                          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                        >
                          {initials ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{session.user?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                      <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Meu painel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/cursos")} className="cursor-pointer">
                      <BookOpen className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Meus cursos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/comunidade")} className="cursor-pointer">
                      <Users className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Comunidade
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/comunidade/chat")} className="cursor-pointer">
                      <MessageSquare className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Chat privado
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/perfil")} className="cursor-pointer">
                      <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Meu perfil
                    </DropdownMenuItem>
                    {isInstructor && (
                      <DropdownMenuItem onClick={() => router.push("/instrutor")} className="cursor-pointer">
                        <BookMarked className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Área do instrutor
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                        <Shield className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Painel admin
                      </DropdownMenuItem>
                    )}
                  </div>

                  <DropdownMenuSeparator />
                  <div className="py-1">
                    <DropdownMenuItem onClick={() => router.push("/trilhas")} className="cursor-pointer">
                      <GraduationCap className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      Trilhas de carreira
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/apoie")} className="cursor-pointer">
                      <Heart className="mr-2.5 h-4 w-4" style={{ color: "#0f62fe" }} />
                      <span style={{ color: "#0f62fe" }}>Apoiar o projeto</span>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />
                  <div className="py-1">
                    <DropdownMenuItem
                      className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-500"
                      onClick={() => signOut({ callbackUrl: "/home" })}
                    >
                      <LogOut className="mr-2.5 h-4 w-4" />
                      Sair da conta
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button
                  className="hidden h-12 items-center px-4 text-sm font-medium sm:flex"
                  style={{ color: "#8d8d8d", background: "transparent", border: "none", cursor: "pointer" }}
                  onClick={() => { window.location.href = "/entrar"; }}
                >
                  Entrar
                </button>
                <Link
                  href="/cadastro"
                  className="hidden h-8 items-center px-4 text-xs font-semibold transition-colors hover:bg-white hover:text-[#0f62fe] sm:flex"
                  style={{ background: "#0f62fe", color: "#fff" }}
                >
                  Começar grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile bottom navigation — only for logged-in users */}
    {session && (
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        {[
          { href: "/dashboard", icon: Home, label: "Início" },
          { href: "/cursos", icon: BookOpen, label: "Cursos" },
          { href: "/comunidade", icon: Users, label: "Comunidade" },
          { href: "/comunidade/chat", icon: MessageSquare, label: "Chat" },
          { href: "/perfil", icon: User, label: "Perfil" },
        ].map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
              style={{ color: active ? "#ffffff" : "#8d8d8d" }}
            >
              <Icon className="h-5 w-5" />
              {label}
              {active && (
                <span
                  className="absolute top-0 h-[2px] w-10 rounded-b"
                  style={{ backgroundColor: "#0f62fe" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    )}
    </>
  );
}
