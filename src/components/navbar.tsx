"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  User,
  Shield,
  BookMarked,
  CreditCard,
  Settings,
  ExternalLink,
  CheckCircle2,
  Search,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";
  const isSubscribed = session?.user?.subscriptionStatus === "ACTIVE";

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navLinks = [
    { href: "/trilhas", label: "Trilhas" },
    { href: "/cursos", label: "Cursos" },
    { href: "/para-empresas", label: "Para Empresas" },
    { href: "/professores", label: "Professores" },
    { href: "/sobre", label: "Sobre" },
    ...(isInstructor ? [{ href: "/instrutor", label: "Área do instrutor" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  async function handlePortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "var(--cds-text-primary)" }}
    >
      <div className="mx-auto max-w-[1584px] px-4 md:px-8">
        <div className="flex h-12 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg shrink-0 text-white">
            <span className="tracking-tight leading-none" style={{ letterSpacing: "0" }}>CFIA</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center h-full">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 h-full flex items-center text-sm transition-colors"
                  style={{
                    color: active ? "#ffffff" : "var(--cds-border-subtle)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-[3px]"
                      style={{ backgroundColor: "#ffffff" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 h-full">
            {/* Search icon */}
            <button
              className="hidden sm:flex h-12 w-12 items-center justify-center transition-colors"
              style={{ color: "var(--cds-background)", backgroundColor: "transparent" }}
              onClick={() => router.push("/cursos")}
            >
              <Search className="h-5 w-5" />
            </button>

            {session ? (
              <>
                {!isSubscribed && !isInstructor && !isAdmin && (
                  <Button
                    size="sm"
                    className="hidden sm:flex h-8 px-4 rounded-none text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--cds-button-primary)",
                      color: "#ffffff"
                    }}
                    asChild
                  >
                    <Link href="/assinar">Assinar</Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="relative outline-none rounded-full ring-2 ring-transparent focus-visible:ring-[#0052ff] ring-offset-2 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? ""} />
                      <AvatarFallback
                        className="text-sm font-bold"
                        style={{ background: "linear-gradient(135deg, #0052ff15, #7c3aed15)", color: "#0052ff" }}
                      >
                        {initials ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                    {/* User info header */}
                    <div className="px-3 py-3 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.user?.image ?? undefined} />
                          <AvatarFallback
                            className="text-sm font-bold"
                            style={{ background: "linear-gradient(135deg, #0052ff15, #7c3aed15)", color: "#0052ff" }}
                          >
                            {initials ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{session.user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      {isSubscribed && (
                        <div
                          className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                          style={{ backgroundColor: "#05966915", color: "#059669" }}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Assinante ativo
                        </div>
                      )}
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
                          Área do instrutor
                        </DropdownMenuItem>
                      )}
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                          <Shield className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Painel admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => router.push("/perfil")} className="cursor-pointer">
                        <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        Meu perfil
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />
                    <div className="py-1">
                      {isSubscribed ? (
                        <>
                          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-3 pb-1">
                            Assinatura
                          </DropdownMenuLabel>
                          <DropdownMenuItem onClick={handlePortal} className="cursor-pointer">
                            <CreditCard className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Gerenciar plano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handlePortal} className="cursor-pointer">
                            <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            Pagamento e fatura
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handlePortal}
                            className="cursor-pointer text-red-500 focus:text-red-500"
                          >
                            <ExternalLink className="mr-2.5 h-4 w-4" />
                            Cancelar assinatura
                          </DropdownMenuItem>
                        </>
                      ) : !isInstructor && !isAdmin ? (
                        <DropdownMenuItem onClick={() => router.push("/assinar")} className="cursor-pointer">
                          <CreditCard className="mr-2.5 h-4 w-4" style={{ color: "#0052ff" }} />
                          <span style={{ color: "#0052ff" }} className="font-medium">
                            Assinar agora
                          </span>
                        </DropdownMenuItem>
                      ) : null}
                    </div>

                    <DropdownMenuSeparator />
                    <div className="py-1">
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
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
                  className="hidden sm:flex h-12 px-4 items-center text-sm font-medium transition-colors"
                  style={{ color: "#c6c6c6", background: "transparent", border: "none", cursor: "pointer" }}
                  onClick={() => window.location.href = "/entrar"}
                >
                  Entrar
                </button>
                <Link
                  href="/cadastro"
                  className="hidden sm:flex h-8 px-4 items-center font-semibold text-xs transition-colors hover:bg-white hover:text-[#0f62fe]"
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
  );
}
