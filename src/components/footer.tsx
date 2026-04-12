import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-primary">cfia</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Centro de Formação em Inteligência Artificial. Aprenda IA com cursos práticos e certificados reconhecidos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cursos" className="hover:text-foreground transition-colors">Cursos</Link></li>
              <li><Link href="/categorias" className="hover:text-foreground transition-colors">Categorias</Link></li>
              <li><Link href="/certificados" className="hover:text-foreground transition-colors">Certificados</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Conta</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/entrar" className="hover:text-foreground transition-colors">Entrar</Link></li>
              <li><Link href="/cadastro" className="hover:text-foreground transition-colors">Cadastrar</Link></li>
              <li><Link href="/instrutor" className="hover:text-foreground transition-colors">Seja instrutor</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} cfia — Centro de Formação em Inteligência Artificial</p>
        </div>
      </div>
    </footer>
  );
}
