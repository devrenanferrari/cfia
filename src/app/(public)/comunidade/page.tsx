import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  PenLine, Users, Zap, BookOpen, TrendingUp, ArrowRight,
} from "lucide-react";
import { SocialPostCard, type SocialPostData } from "@/components/community/social-post-card";
import { CreatePostBox } from "@/components/community/create-post-box";
import { SuggestConnectButtonClient } from "@/components/community/suggest-connect-button";
import { TagFilter } from "@/components/community/tag-filter";
import { UserSearchBox } from "@/components/community/user-search";

export const metadata = { title: "Comunidade | CFIA" };

export default async function ComunidadePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const session = await getServerSession(authOptions);

  const [posts, totalUsers, totalPosts, xpData, connectionCount, myConnections] = await Promise.all([
    prisma.post.findMany({
      take: 40,
      orderBy: { createdAt: "desc" },
      where: tag ? { tags: { has: tag } } : undefined,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
        votes: { select: { value: true, userId: true } },
      },
    }),
    prisma.user.count(),
    prisma.post.count(),
    session ? prisma.userXP.findUnique({ where: { userId: session.user.id } }) : null,
    session
      ? prisma.connection.count({
          where: {
            status: "ACCEPTED",
            OR: [{ fromId: session.user.id }, { toId: session.user.id }],
          },
        })
      : 0,
    session
      ? prisma.connection.findMany({
          where: { OR: [{ fromId: session.user.id }, { toId: session.user.id }] },
          select: { fromId: true, toId: true, status: true },
        })
      : [],
  ]);

  const connMap = new Map<string, "pending" | "accepted">();
  if (session) {
    for (const c of myConnections) {
      const otherId = c.fromId === session.user.id ? c.toId : c.fromId;
      connMap.set(otherId, c.status === "ACCEPTED" ? "accepted" : "pending");
    }
  }

  const suggestions = session
    ? await prisma.user.findMany({
        where: {
          id: { not: session.user.id },
          connectionsFrom: { none: { toId: session.user.id } },
          connectionsTo: { none: { fromId: session.user.id } },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, role: true, _count: { select: { posts: true } } },
      })
    : [];

  const level = xpData ? Math.floor(xpData.xp / 100) + 1 : 1;
  const xp = xpData?.xp ?? 0;
  const xpToNext = level * 100;
  const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

  const serializedPosts: SocialPostData[] = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    connectionStatus: connMap.get(p.author.id) ?? "none",
  }));

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1200px] px-0 sm:px-4 py-0 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-4">

          {/* ── Sidebar Esquerda (desktop only) ── */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-3">

            {/* Card do perfil */}
            <div className="bg-white border border-[#e0e0e0] overflow-hidden">
              <div className="h-16 relative" style={{ backgroundColor: "#0f62fe" }}>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "8px 8px",
                  }}
                />
              </div>
              <div className="px-4 pb-4">
                <div
                  className="-mt-8 mb-3 h-16 w-16 rounded-full border-4 border-white flex items-center justify-center font-bold text-xl select-none"
                  style={{ backgroundColor: "#161616", color: "#ffffff" }}
                >
                  {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>

                {session ? (
                  <>
                    <p className="text-sm font-bold leading-tight" style={{ color: "#161616" }}>
                      {session.user.name}
                    </p>
                    <p className="text-xs mt-0.5 mb-3" style={{ color: "#8d8d8d" }}>
                      {session.user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · CFIA
                    </p>

                    {/* Stats rápidos */}
                    <div className="grid grid-cols-2 gap-px mb-3" style={{ backgroundColor: "#e0e0e0" }}>
                      <div className="bg-white py-2 text-center">
                        <p className="text-base font-bold" style={{ color: "#161616" }}>{connectionCount}</p>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>Conexões</p>
                      </div>
                      <div className="bg-white py-2 text-center">
                        <p className="text-base font-bold" style={{ color: "#161616" }}>{level}</p>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>Nível</p>
                      </div>
                    </div>

                    {/* XP bar */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-mono" style={{ color: "#525252" }}>
                          {xp} XP
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: "#8d8d8d" }}>
                          {xpToNext} para nível {level + 1}
                        </span>
                      </div>
                      <div className="h-1.5 w-full" style={{ backgroundColor: "#e0e0e0" }}>
                        <div
                          className="h-1.5 transition-all"
                          style={{ width: `${xpPct}%`, backgroundColor: "#0f62fe" }}
                        />
                      </div>
                    </div>

                    {/* Links rápidos */}
                    <div className="border-t pt-3" style={{ borderColor: "#f4f4f4" }}>
                      <Link
                        href="/dashboard/cursos"
                        className="flex items-center gap-2 text-xs py-1.5 hover:text-[#0f62fe] transition-colors"
                        style={{ color: "#525252" }}
                      >
                        <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
                        Meus cursos
                      </Link>
                      <Link
                        href="/trilhas"
                        className="flex items-center gap-2 text-xs py-1.5 hover:text-[#0f62fe] transition-colors"
                        style={{ color: "#525252" }}
                      >
                        <TrendingUp className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
                        Trilhas de carreira
                      </Link>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: "#161616" }}>Entre na comunidade</p>
                    <p className="text-xs mb-3" style={{ color: "#8d8d8d" }}>
                      Crie uma conta e comece a interagir.
                    </p>
                    <Link
                      href="/cadastro"
                      className="flex items-center justify-center text-xs font-bold h-9 w-full transition-colors hover:bg-[#0353e9]"
                      style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                    >
                      Criar conta grátis
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Atalhos da plataforma */}
            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Explorar
              </p>
              <div className="space-y-0.5">
                {[
                  { href: "/cursos", label: "Cursos" },
                  { href: "/trilhas", label: "Trilhas de carreira" },
                  { href: "/laboratorio", label: "Laboratório" },
                  { href: "/sobre", label: "Sobre o CFIA" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-2 text-xs px-2 py-2 hover:bg-[#f4f4f4] transition-colors group"
                    style={{ color: "#525252" }}
                  >
                    <ArrowRight className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: "#0f62fe" }} />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          {/* ── Feed Central ── */}
          <main className="lg:col-span-6 flex flex-col gap-0 sm:gap-3">

            {/* CreatePostBox */}
            <div className="sm:block">
              <CreatePostBox />
            </div>

            {/* Filtros de tag */}
            <div className="bg-white border-y sm:border border-[#e0e0e0] px-4 py-2.5">
              <TagFilter />
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="bg-white border border-[#e0e0e0] p-12 text-center">
                <PenLine className="h-10 w-10 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
                <p className="text-base font-semibold mb-1" style={{ color: "#161616" }}>
                  {tag ? `Nenhum post com "${tag}" ainda.` : "Ninguém publicou ainda."}
                </p>
                <p className="text-sm" style={{ color: "#8d8d8d" }}>
                  Seja o primeiro a compartilhar algo!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0 sm:gap-3">
                {serializedPosts.map((post) => (
                  <SocialPostCard
                    key={post.id}
                    post={post}
                    currentUserId={session?.user?.id}
                  />
                ))}
              </div>
            )}

          </main>

          {/* ── Sidebar Direita (desktop only) ── */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-3">

            {/* Pesquisar pessoas */}
            {session && <UserSearchBox />}

            {/* Stats da comunidade */}
            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Comunidade CFIA
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "#525252" }}>
                    <Users className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} /> Membros
                  </span>
                  <span className="font-bold" style={{ color: "#161616" }}>{totalUsers.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "#525252" }}>
                    <PenLine className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} /> Publicações
                  </span>
                  <span className="font-bold" style={{ color: "#161616" }}>{totalPosts.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "#525252" }}>
                    <Zap className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} /> Sistema de XP
                  </span>
                  <span className="font-bold" style={{ color: "#0f62fe" }}>Ativo</span>
                </div>
              </div>
              {!session && (
                <Link
                  href="/cadastro"
                  className="mt-4 flex items-center justify-center text-xs font-bold h-9 w-full transition-colors hover:bg-[#0353e9]"
                  style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                >
                  Participar da comunidade
                </Link>
              )}
            </div>

            {/* Sugestões de conexão */}
            {suggestions.length > 0 && (
              <div className="bg-white border border-[#e0e0e0] p-4">
                <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                  Pessoas que você pode conhecer
                </p>
                <div className="space-y-3">
                  {suggestions.map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 select-none"
                        style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                      >
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: "#161616" }}>
                          {u.name}
                        </p>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>
                          {u.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"}
                          {u._count.posts > 0 ? ` · ${u._count.posts} post${u._count.posts !== 1 ? "s" : ""}` : ""}
                        </p>
                      </div>
                      <SuggestConnectButtonClient toId={u.id} initialStatus={connMap.get(u.id) ?? "none"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regras */}
            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Regras da comunidade
              </p>
              <ol className="space-y-2 text-xs" style={{ color: "#525252" }}>
                {[
                  "Respeito acima de tudo",
                  "Foco em programação e IA",
                  "Sem spam ou autopromoção",
                  "Compartilhe conteúdo real",
                ].map((r, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="font-mono font-bold shrink-0 mt-0.5" style={{ color: "#0f62fe" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {r}
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
