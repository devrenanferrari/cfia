export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { deleteNews } from "@/app/actions/news";

export default async function AdminNewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const newsList = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } }
    }
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
            Gerenciar Notícias
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--cds-text-secondary)" }}>
            Adicione artigos que aparecerão na página inicial.
          </p>
        </div>
        <Button
          className="rounded-none font-semibold"
          style={{ backgroundColor: "var(--cds-button-primary)", color: "#ffffff" }}
          asChild
        >
          <Link href="/admin/noticias/nova">
            <Plus className="mr-2 h-4 w-4" /> Escrever Notícia
          </Link>
        </Button>
      </div>

      <div className="border border-[var(--cds-border-subtle)] bg-white">
        {newsList.length === 0 ? (
          <div className="p-12 text-center">
            <p style={{ color: "var(--cds-text-secondary)" }}>Nenhuma notícia foi criada ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--cds-border-subtle)]">
            {newsList.map((news) => (
              <div key={news.id} className="p-4 flex items-center justify-between group transition-colors hover:bg-[var(--cds-layer-01)]">
                <div>
                  <h3 className="font-semibold text-base" style={{ color: "var(--cds-text-primary)" }}>{news.title}</h3>
                  <div className="flex gap-4 mt-1 text-sm" style={{ color: "var(--cds-text-secondary)" }}>
                    <span>Por {news.author.name}</span>
                    <span>•</span>
                    <span>{new Intl.DateTimeFormat('pt-BR').format(news.createdAt)}</span>
                    <span>•</span>
                    <span 
                      className={news.published ? "font-semibold" : ""} 
                      style={{ color: news.published ? "var(--cds-support-success)" : "var(--cds-text-helper)" }}
                    >
                      {news.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <form action={async () => {
                    "use server";
                    await deleteNews(news.id);
                  }}>
                    <button 
                      type="submit"
                      className="h-10 w-10 flex items-center justify-center transition-colors hover:bg-[var(--cds-layer-02)]"
                      style={{ color: "var(--cds-support-error)" }}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
