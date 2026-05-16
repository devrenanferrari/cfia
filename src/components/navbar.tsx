"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  User,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  const initials = session?.user?.name
    ?.split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navLinks = [
    { href: "/trilhas", label: "Trilhas" },
    { href: "/cursos", label: "Cursos" },
    { href: "/comunidade", label: "Comunidade" },
    { href: "/laboratorio", label: "Laboratorio" },
    { href: "/apoie", label: "Apoie" },
    { href: "/professores", label: "Professores" },
    { href: "/sobre", label: "Sobre" },
    ...(isInstructor ? [{ href: "/instrutor", label: "Area do instrutor" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "var(--cds-text-primary)" }}>
      <div className="mx-auto max-w-[1584px] px-4 md:px-8">
        <div className="flex h-12 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold text-white">
            <span className="leading-none" style={{ letterSpacing: "0" }}>CFIA</span>
          </Link>

          <nav className="hidden h-full items-center md:flex">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex h-full items-center px-4 text-sm transition-colors"
                  style={{
                    color: active ? "#ffffff" : "var(--cds-border-subtle)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full" style={{ backgroundColor: "#ffffff" }} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex h-full items-center gap-2">
            <button
              className="hidden h-12 w-12 items-center justify-center transition-colors sm:flex"
              style={{ color: "var(--cds-background)", backgroundColor: "transparent" }}
              onClick={() => router.push("/cursos")}
              aria-label="Buscar cursos"
            >
              <Search className="h-5 w-5" />
            </button>

            {session ? (
              <>
                {!isInstructor && !isAdmin && (
                  <Button
                    size="sm"
                    className="hidden h-8 rounded-none px-4 text-xs font-semibold sm:flex"
                    style={{ backgroundColor: "var(--cds-button-primary)", color: "#ffffff" }}
                    asChild
                  >
                    <Link href="/apoie">Apoiar</Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="relative rounded-full outline-none ring-2 ring-transparent ring-offset-2 transition-all focus-visible:ring-[#0052ff]">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? ""} />
                      <AvatarFallback className="text-sm font-bold" style={{ backgroundColor: "#edf5ff", color: "#0052ff" }}>
                        {initials ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                    <div className="border-b px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user?.image ?? undefined} />
                          <AvatarFallback className="text-sm font-bold" style={{ backgroundColor: "#edf5ff", color: "#0052ff" }}>
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
                      {isInstructor && (
                        <DropdownMenuItem onClick={() => router.push("/instrutor")} className="cursor-pointer">
                          <BookMarked className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Area do instrutor
                        </DropdownMenuItem>
                      )}
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                          <Shield className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Painel admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => router.push("/comunidade")} className="cursor-pointer">
                        <MessageSquare className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Comunidade
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/perfil")} className="cursor-pointer">
                        <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Meu perfil
                      </DropdownMenuItem>
                    </div>

                    {!isInstructor && !isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="py-1">
                          <DropdownMenuItem onClick={() => router.push("/apoie")} className="cursor-pointer">
                            <Heart className="mr-2.5 h-4 w-4" style={{ color: "#0052ff" }} />
                            <span className="font-medium" style={{ color: "#0052ff" }}>
                              Apoiar o projeto
                            </span>
                          </DropdownMenuItem>
                        </div>
                      </>
                    )}

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
              </>
            ) : (
              <>
                <button
                  className="hidden h-12 items-center px-4 text-sm font-medium transition-colors sm:flex"
                  style={{ color: "#c6c6c6", background: "transparent", border: "none", cursor: "pointer" }}
                  onClick={() => { window.location.href = "/entrar"; }}
                >
                  Entrar
                </button>
                <Link
                  href="/cadastro"
                  className="hidden h-8 items-center px-4 text-xs font-semibold transition-colors hover:bg-white hover:text-[#0f62fe] sm:flex"
                  style={{ background: "#0f62fe", color: "#fff" }}
                >
                  Comecar gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
