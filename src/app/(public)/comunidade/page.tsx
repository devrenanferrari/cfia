import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, PenLine, Users, Zap, BookOpen, MessageSquare } from "lucide-react";
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

  const [posts, totalUsers, xpData, connectionCount, myConnections] = await Promise.all([
    prisma.post.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      where: tag ? { tags: { has: tag } } : undefined,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
        votes: { select: { value: true, userId: true } },
      },
    }),
    prisma.user.count(),
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

  // Mapa userId → status de conexão
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
        take: 5,
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
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── Sidebar Esquerda ─────────────────────────────────────────── */}
          <aside className="lg:col-span-3 space-y-3 hidden lg:block">

            <div className="bg-white border border-[#e0e0e0] overflow-hidden">
              <div className="h-14" style={{ backgroundColor: "#0f62fe" }} />
              <div className="px-4 pb-4">
                <div
                  className="-mt-7 mb-3 h-14 w-14 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: "#161616", color: "#ffffff" }}
                >
                  {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                {session ? (
                  <>
                    <p className="text-sm font-bold leading-tight" style={{ color: "#161616" }}>
                      {session.user.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>
                      {session.user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · CFIA
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono" style={{ color: "#525252" }}>
                          Nível {level} — {xp} XP
                        </span>
                        <span className="text-[10px]" style={{ color: "#8d8d8d" }}>{xpPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#e0e0e0" }}>
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${xpPct}%`, backgroundColor: "#0f62fe" }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <Link
                        href="/comunidade/chat"
                        className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-[#f4f4f4] transition-colors w-full"
                        style={{ color: "#525252" }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
                        <span>Chat privado</span>
                      </Link>
                      <Link
                        href="/dashboard/cursos"
                        className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-[#f4f4f4] transition-colors w-full"
                        style={{ color: "#525252" }}
                      >
                        <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
                        <span>Meus cursos</span>
                      </Link>
                      <div
                        className="flex items-center gap-2 text-xs px-2 py-1.5"
                        style={{ color: "#525252" }}
                      >
                        <Users className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
                        <span><strong>{connectionCount}</strong> conexões</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold" style={{ color: "#161616" }}>
                      Entre na comunidade
                    </p>
                    <p className="text-xs mt-1 mb-3" style={{ color: "#8d8d8d" }}>
                      Crie uma conta gratuita e comece a interagir.
                    </p>
                    <Link
                      href="/cadastro"
                      className="flex items-center justify-center text-xs font-semibold h-8"
                      style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                    >
                      Criar conta grátis
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Descobrir
              </p>
              <div className="space-y-1">
                {[
                  { href: "/cursos", label: "Ver cursos" },
                  { href: "/trilhas", label: "Trilhas de carreira" },
                  { href: "/laboratorio", label: "Laboratório" },
                  { href: "/sobre", label: "Sobre o CFIA" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-[#f4f4f4] transition-colors"
                    style={{ color: "#525252" }}
                  >
                    <ArrowRight className="h-3 w-3 shrink-0" style={{ color: "#0f62fe" }} />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Feed Central ─────────────────────────────────────────────── */}
          <main className="lg:col-span-6 space-y-3">
            <CreatePostBox />

            {/* Filtro por tag */}
            <TagFilter />

            {posts.length === 0 ? (
              <div className="bg-white border border-[#e0e0e0] p-12 text-center">
                <PenLine className="h-10 w-10 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
                <p className="text-base font-light mb-1" style={{ color: "#161616" }}>
                  {tag ? `Nenhum post com a tag "${tag}" ainda.` : "Ninguém publicou ainda."}
                </p>
                <p className="text-sm" style={{ color: "#8d8d8d" }}>
                  {tag ? "Tente outra tag ou escreva o primeiro." : "Seja o primeiro a compartilhar algo."}
                </p>
              </div>
            ) : (
              serializedPosts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  currentUserId={session?.user?.id}
                />
              ))
            )}
          </main>

          {/* ── Sidebar Direita ───────────────────────────────────────────── */}
          <aside className="lg:col-span-3 space-y-3 hidden lg:block">

            {/* Pesquisar pessoas */}
            {session && <UserSearchBox />}

            {suggestions.length > 0 && (
              <div className="bg-white border border-[#e0e0e0] p-4">
                <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                  Pessoas que você pode conhecer
                </p>
                <div className="space-y-3">
                  {suggestions.map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: "#edf5ff", color: "#0f62fe" }}
                      >
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "#161616" }}>
                          {u.name}
                        </p>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>
                          {u.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · {u._count.posts} post{u._count.posts !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <SuggestConnectButtonClient toId={u.id} initialStatus={connMap.get(u.id) ?? "none"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Comunidade
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#525252" }}>Membros</span>
                  <span className="font-semibold" style={{ color: "#161616" }}>{totalUsers}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#525252" }}>Publicações</span>
                  <span className="font-semibold" style={{ color: "#161616" }}>{posts.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#525252" }}>Gamificado</span>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: "#0f62fe" }}>
                    <Zap className="h-3 w-3" /> XP
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                Regras
              </p>
              <ol className="space-y-1.5 text-xs" style={{ color: "#525252" }}>
                {["Respeito acima de tudo", "Foco em programação e IA", "Sem spam", "Conteúdo real"].map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono font-bold shrink-0" style={{ color: "#0f62fe" }}>
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
