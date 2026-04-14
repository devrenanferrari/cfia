import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";

export default async function NewNewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 space-y-8 max-w-[1584px] pb-12">
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
            Editorial: Nova Publicação
          </h1>
          <p className="text-sm text-[#6f6f6f] mt-1">Utilize o editor abaixo para criar relatórios técnicos e atualizações.</p>
        </div>
      </div>

      <NewsForm />
    </div>
  );
}
