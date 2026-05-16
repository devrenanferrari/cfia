import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Users, MessageSquare, Zap } from "lucide-react";
import { PostCard } from "@/components/community/post-card";

export const metadata = { title: "Comunidade | CFIA" };

export default async function ComunidadePage() {
  const session = await getServerSession(authOptions);

  const posts = await prisma.post.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, votes: true } },
      votes: { select: { value: true, userId: true } },
    },
  });

  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section
        className="pt-24 pb-16 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-8 bg-[#0f62fe]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d]">
              Rede da comunidade
            </span>
          </div>
          <h1
            className="text-5xl md:text-[64px] font-light leading-[1.05] mb-6 text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Comunidade CFIA
          </h1>
          <p className="text-lg text-[#c6c6c6] max-w-2xl leading-relaxed mb-10">
            Compartilhe projetos, tire dúvidas, troque recursos e converse com outros estudantes de programação e IA.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            {session ? (
              <Link
                href="/comunidade/novo"
                className="h-12 px-8 flex items-center gap-3 font-semibold text-sm"
                style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
              >
                Publicar post <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/entrar?callbackUrl=/comunidade/novo"
                className="h-12 px-8 flex items-center gap-3 font-semibold text-sm"
                style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
              >
                Entrar para publicar <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {session && (
              <Link
                href="/comunidade/chat"
                className="h-12 px-6 flex items-center gap-2 font-semibold text-sm border transition-colors hover:border-white"
                style={{ borderColor: "#525252", color: "#c6c6c6" }}
              >
                <MessageSquare className="h-4 w-4" /> Chat privado
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px] px-4 md:px-8 flex gap-8 py-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
            <Users className="h-4 w-4" style={{ color: "#0f62fe" }} />
            <span><strong className="font-semibold" style={{ color: "#161616" }}>{totalUsers}</strong> membros</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
            <MessageSquare className="h-4 w-4" style={{ color: "#0f62fe" }} />
            <span><strong className="font-semibold" style={{ color: "#161616" }}>{totalPosts}</strong> posts</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
            <Zap className="h-4 w-4" style={{ color: "#0f62fe" }} />
            <span>Gamificado com XP</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feed */}
          <main className="lg:col-span-8">
            {posts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#e0e0e0]">
                <p className="text-lg font-light mb-2" style={{ color: "#161616" }}>Ainda não há posts.</p>
                <p className="text-sm mb-6" style={{ color: "#8d8d8d" }}>Seja o primeiro a compartilhar algo com a comunidade.</p>
                {session && (
                  <Link
                    href="/comunidade/novo"
                    className="inline-flex items-center gap-2 h-10 px-6 text-sm font-semibold"
                    style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                  >
                    Criar primeiro post <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-px bg-[#e0e0e0] border border-[#e0e0e0]">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{ ...post, createdAt: post.createdAt.toISOString() }}
                    currentUserId={session?.user?.id}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="border border-[#e0e0e0] p-6" style={{ backgroundColor: "#f4f4f4" }}>
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-mono"
                style={{ color: "#8d8d8d" }}
              >
                Sobre a comunidade
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                Espaço para estudantes de programação e IA do CFIA trocarem conhecimento, compartilharem projetos e aprenderem juntos.
              </p>
              <div className="mt-4 pt-4 border-t border-[#e0e0e0] space-y-2 text-sm" style={{ color: "#525252" }}>
                <p>✓ Compartilhe projetos e repositórios</p>
                <p>✓ Tire dúvidas sobre código e IA</p>
                <p>✓ Ganhe XP por participar</p>
                <p>✓ Conecte-se com outros estudantes</p>
              </div>
              {!session && (
                <Link
                  href="/cadastro"
                  className="mt-5 w-full h-10 flex items-center justify-center gap-2 text-sm font-semibold"
                  style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                >
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="border border-[#e0e0e0] p-6 bg-white">
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-mono"
                style={{ color: "#8d8d8d" }}
              >
                Regras da comunidade
              </p>
              <ol className="space-y-2 text-sm" style={{ color: "#525252" }}>
                {[
                  "Respeito acima de tudo",
                  "Conteúdo relevante a programação e IA",
                  "Sem spam ou autopromoção excessiva",
                  "Código e projetos são bem-vindos",
                  "Dúvidas sinceras merecem respostas sinceras",
                ].map((rule, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-[11px] font-bold shrink-0" style={{ color: "#0f62fe" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
