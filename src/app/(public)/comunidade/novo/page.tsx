import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/community/post-form";

export const metadata = { title: "Novo post | Comunidade CFIA" };

export default async function NovoComunidadePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/comunidade/novo");

  return (
    <div className="bg-white min-h-screen">
      <section
        className="pt-20 pb-12 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
            style={{ color: "#8d8d8d" }}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar à comunidade
          </Link>
          <h1
            className="text-4xl font-light text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Novo post
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <PostForm />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border border-[#e0e0e0] p-6" style={{ backgroundColor: "#f4f4f4" }}>
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-mono"
                style={{ color: "#8d8d8d" }}
              >
                Dicas para um bom post
              </p>
              <ul className="space-y-2 text-sm" style={{ color: "#525252" }}>
                <li>✓ Use um título claro e descritivo</li>
                <li>✓ Inclua código quando relevante</li>
                <li>✓ Adicione tags para facilitar a busca</li>
                <li>✓ Para dúvidas, descreva o que já tentou</li>
                <li>✓ Para projetos, inclua o link do repositório</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
