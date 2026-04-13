import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createNews } from "@/app/actions/news";

export default async function NewNewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl pb-12">
      <div className="flex items-center gap-4 border-b border-[var(--cds-border-subtle)] pb-4">
        <Link 
          href="/admin/noticias" 
          className="h-10 w-10 flex items-center justify-center transition-colors hover:bg-[var(--cds-layer-01)]"
          style={{ color: "var(--cds-text-secondary)" }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
            Nova Notícia
          </h1>
        </div>
      </div>

      <form action={createNews} className="space-y-6 bg-white border border-[var(--cds-border-subtle)] p-8">
        
        <div className="space-y-2">
          <label htmlFor="title" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full h-12 px-4 transition-colors focus:outline-none"
            style={{ 
              backgroundColor: "var(--cds-field)", 
              borderBottom: "1px solid var(--cds-border-strong)",
              color: "var(--cds-text-primary)"
            }}
            placeholder="Ex: CFIA lança novo curso de Machine Learning"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="summary" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
            Resumo (Subtítulo)
          </label>
          <input
            id="summary"
            name="summary"
            type="text"
            className="w-full h-12 px-4 transition-colors focus:outline-none"
            style={{ 
              backgroundColor: "var(--cds-field)", 
              borderBottom: "1px solid var(--cds-border-strong)",
              color: "var(--cds-text-primary)"
            }}
            placeholder="Um breve resumo que aparecerá na página inicial"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
            Conteúdo (Texto)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            className="w-full p-4 transition-colors focus:outline-none resize-y"
            style={{ 
              backgroundColor: "var(--cds-field)", 
              borderBottom: "1px solid var(--cds-border-strong)",
              color: "var(--cds-text-primary)",
              lineHeight: "1.6"
            }}
            placeholder="Escreva o conteúdo da notícia aqui. Parágrafos longos, comunicados oficiais, etc."
          />
          <p className="text-xs" style={{ color: "var(--cds-text-helper)" }}>Por enquanto utiliza texto simples. As quebras de linha são renderizadas automaticamente.</p>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="h-5 w-5 rounded-none"
            defaultChecked
            style={{ accentColor: "var(--cds-interactive)" }}
          />
          <label htmlFor="published" className="text-sm font-medium" style={{ color: "var(--cds-text-primary)" }}>
            Publicar imediatamente
          </label>
        </div>

        <div className="pt-8 border-t border-[var(--cds-border-subtle)] flex justify-end gap-4">
          <Button
            type="button"
            className="rounded-none font-semibold px-6 border"
            style={{ backgroundColor: "transparent", color: "var(--cds-button-primary)", borderColor: "var(--cds-button-primary)" }}
            asChild
          >
            <Link href="/admin/noticias">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            className="rounded-none font-semibold px-8"
            style={{ backgroundColor: "var(--cds-button-primary)", color: "#ffffff" }}
          >
            Salvar Notícia
          </Button>
        </div>

      </form>
    </div>
  );
}
