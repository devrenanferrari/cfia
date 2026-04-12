"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-primary">cfia</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">
              Cursos
            </Link>
            <Link href="/categorias" className="text-muted-foreground hover:text-foreground transition-colors">
              Categorias
            </Link>
            {(session?.user?.role === "INSTRUCTOR" || session?.user?.role === "ADMIN") && (
              <Link href="/instrutor" className="text-muted-foreground hover:text-foreground transition-colors">
                Instrutor
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative h-9 w-9 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? ""} />
                    <AvatarFallback>{initials ?? "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <p className="font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Meu painel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/cursos")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Meus cursos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/perfil")}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/entrar">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/cadastro">Começar grátis</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
