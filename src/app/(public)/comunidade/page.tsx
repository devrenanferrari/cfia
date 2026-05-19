export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PenLine, Users, Zap, BookOpen, TrendingUp, ArrowRight, Search, Flame, Clock } from "lucide-react";
import { SocialPostCard, type SocialPostData } from "@/components/community/social-post-card";
import { CreatePostBox } from "@/components/community/create-post-box";
import { SuggestConnectButtonClient } from "@/components/community/suggest-connect-button";
import { TagFilter } from "@/components/community/tag-filter";
import { UserSearchBox } from "@/components/community/user-search";

export const metadata = { title: "Comunidade | CFIA" };

export default async function ComunidadePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string; sort?: string; page?: string }>;
}) {
  const { tag, q, sort, page } = await searchParams;
  const session = await getServerSession(authOptions);
  const pageNum = Math.max(1, parseInt(page ?? "1", 10));
  const PER_PAGE = 20;

  const postWhere: Record<string, unknown> = {};
  if (tag) postWhere.tags = { has: tag };
  if (q?.trim()) {
    postWhere.OR = [
      { title: { contains: q.trim(), mode: "insensitive" } },
      { body: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "popular"
      ? [{ votes: { _count: "desc" as const } }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const whereClause = Object.keys(postWhere).length ? postWhere : undefined;

  const [posts, totalPosts, totalUsers, xpData, connectionCount, myConnections, topTags] = await Promise.all([
    prisma.post.findMany({
      take: PER_PAGE,
      skip: (pageNum - 1) * PER_PAGE,
      orderBy,
      where: whereClause,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true } },
        votes: { select: { value: true, userId: true } },
        savedBy: session ? { where: { userId: session.user.id }, select: { id: true } } : false,
      },
    }),
    prisma.post.count({ where: whereClause }),
    prisma.user.count(),
    session ? prisma.userXP.findUnique({ where: { userId: session.user.id } }) : null,
    session
      ? prisma.connection.count({ where: { status: "ACCEPTED", OR: [{ fromId: session.user.id }, { toId: session.user.id }] } })
      : 0,
    session
      ? prisma.connection.findMany({ where: { OR: [{ fromId: session.user.id }, { toId: session.user.id }] }, select: { fromId: true, toId: true, status: true } })
      : [],
    prisma.post.findMany({ select: { tags: true }, take: 200, orderBy: { createdAt: "desc" } }),
  ]);

  // Compute top tags dynamically
  const tagCount: Record<string, number> = {};
  for (const p of topTags) for (const t of p.tags) tagCount[t] = (tagCount[t] ?? 0) + 1;
  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 12);

  const connMap = new Map<string, "pending" | "accepted">();
  if (session) {
    for (const c of myConnections) {
      const otherId = c.fromId === session.user.id ? c.toId : c.fromId;
      connMap.set(otherId, c.status === "ACCEPTED" ? "accepted" : "pending");
    }
  }

  const suggestions = session
    ? await prisma.user.findMany({
        where: { id: { not: session.user.id }, connectionsFrom: { none: { toId: session.user.id } }, connectionsTo: { none: { fromId: session.user.id } } },
        take: 6, orderBy: { createdAt: "desc" },
        select: { id: true, name: true, role: true, _count: { select: { posts: true } } },
      })
    : [];

  const level = xpData ? Math.floor(xpData.xp / 100) + 1 : 1;
  const xp = xpData?.xp ?? 0;
  const xpToNext = level * 100;
  const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));
  const totalPages = Math.ceil(totalPosts / PER_PAGE);

  const serializedPosts: SocialPostData[] = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    connectionStatus: connMap.get(p.author.id) ?? "none",
    savedByCurrentUser: Array.isArray(p.savedBy) ? p.savedBy.length > 0 : false,
  }));

  const initials = session?.user?.name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") ?? "?";
  const activeSort = sort === "popular" ? "popular" : "recent";

  function pageHref(p: number) {
    const ps = new URLSearchParams();
    if (q) ps.set("q", q);
    if (tag) ps.set("tag", tag);
    if (sort && sort !== "recent") ps.set("sort", sort);
    if (p > 1) ps.set("page", String(p));
    const qs = ps.toString();
    return `/comunidade${qs ? `?${qs}` : ""}`;
  }

  function sortHref(s: string) {
    const ps = new URLSearchParams();
    if (q) ps.set("q", q);
    if (tag) ps.set("tag", tag);
    if (s !== "recent") ps.set("sort", s);
    return `/comunidade${ps.toString() ? `?${ps.toString()}` : ""}`;
  }

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1200px] px-0 sm:px-4 py-0 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-4">

          {/* ── Sidebar Esquerda ── */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-3">
            <div className="bg-white border border-[#e0e0e0] overflow-hidden">
              {session ? (
                <>
                  <div className="relative h-20" style={{ backgroundColor: "#0f62fe" }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize: "10px 10px" }} />
                    <Link href={`/u/${session.user.id}`}>
                      <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-base select-none hover:opacity-90 transition-opacity" style={{ backgroundColor: "#161616", color: "#fff" }}>
                        {initials}
                      </div>
                    </Link>
                  </div>
                  <div className="pt-8 px-4 pb-4">
                    <Link href={`/u/${session.user.id}`} className="text-sm font-bold hover:text-[#0f62fe] transition-colors inline-block" style={{ color: "#161616" }}>{session.user.name}</Link>
                    <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>{session.user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · CFIA</p>
                    <div className="mt-3 mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-mono font-semibold" style={{ color: "#0f62fe" }}>Nível {level}</span>
                        <span className="text-[11px] font-mono" style={{ color: "#8d8d8d" }}>{xp}/{xpToNext} XP</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#e0e0e0" }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${xpPct}%`, backgroundColor: "#0f62fe" }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-px border rounded-sm overflow-hidden mb-3" style={{ borderColor: "#e0e0e0", backgroundColor: "#e0e0e0" }}>
                      <div className="bg-white py-2 text-center">
                        <p className="text-base font-bold" style={{ color: "#161616" }}>{connectionCount}</p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8d8d8d" }}>Conexões</p>
                      </div>
                      <div className="bg-white py-2 text-center">
                        <p className="text-base font-bold" style={{ color: "#161616" }}>{level}</p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8d8d8d" }}>Nível</p>
                      </div>
                    </div>
                    <div className="space-y-0.5 border-t pt-3" style={{ borderColor: "#f4f4f4" }}>
                      {[
                        { href: `/u/${session.user.id}`, label: "Meu perfil", icon: Users },
                        { href: "/dashboard/cursos", label: "Meus cursos", icon: BookOpen },
                        { href: "/trilhas", label: "Trilhas", icon: TrendingUp },
                        { href: "/conexoes", label: "Minhas conexões", icon: Users },
                      ].map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} className="flex items-center gap-2 text-xs py-1.5 hover:text-[#0f62fe] transition-colors" style={{ color: "#525252" }}>
                          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} /> {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3 font-bold text-lg" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>?</div>
                  <p className="text-sm font-bold mb-1" style={{ color: "#161616" }}>Entre na comunidade</p>
                  <p className="text-xs mb-3" style={{ color: "#8d8d8d" }}>Crie uma conta e comece a interagir.</p>
                  <Link href="/cadastro" className="flex items-center justify-center text-xs font-bold h-9 w-full transition-colors hover:bg-[#0353e9]" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
                    Criar conta grátis
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-2" style={{ color: "#8d8d8d" }}>Explorar</p>
              <div className="space-y-0.5">
                {[{ href: "/cursos", label: "Cursos" }, { href: "/trilhas", label: "Trilhas de carreira" }, { href: "/laboratorio", label: "Laboratório" }, { href: "/sobre", label: "Sobre o CFIA" }].map((l) => (
                  <Link key={l.href} href={l.href} className="flex items-center gap-2 text-xs px-2 py-2 hover:bg-[#f4f4f4] transition-colors group" style={{ color: "#525252" }}>
                    <ArrowRight className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: "#0f62fe" }} />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Feed Central ── */}
          <main className="lg:col-span-6 flex flex-col gap-0 sm:gap-3">
            <CreatePostBox />

            {/* Busca */}
            <form method="GET" action="/comunidade" className="bg-white border-y sm:border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f4f4f4]">
                <Search className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
                <input name="q" defaultValue={q} placeholder="Buscar publicações..." className="flex-1 text-sm bg-transparent focus:outline-none" style={{ color: "#161616" }} />
                {q && <Link href="/comunidade" className="text-xs hover:underline" style={{ color: "#8d8d8d" }}>Limpar</Link>}
              </div>
              <div className="px-4 py-2"><TagFilter /></div>
            </form>

            {/* Tabs de ordenação */}
            <div className="flex items-center bg-white border-y sm:border border-[#e0e0e0]">
              {[{ key: "recent", label: "Recentes", icon: Clock }, { key: "popular", label: "Populares", icon: Flame }].map(({ key, label, icon: Icon }, i) => (
                <>
                  {i > 0 && <div key={`d${key}`} className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />}
                  <Link key={key} href={sortHref(key)}
                    className="flex flex-1 items-center justify-center gap-1.5 h-10 text-xs font-bold transition-colors border-b-2"
                    style={{ color: activeSort === key ? "#0f62fe" : "#525252", borderColor: activeSort === key ? "#0f62fe" : "transparent", backgroundColor: activeSort === key ? "#f0f7ff" : "transparent" }}>
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </Link>
                </>
              ))}
            </div>

            {(q || tag) && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs bg-white border-y sm:border border-[#e0e0e0]" style={{ color: "#525252" }}>
                <span>{posts.length} resultado{posts.length !== 1 ? "s" : ""}{q ? ` para "${q}"` : ""}{tag ? ` · tag: ${tag}` : ""}</span>
                <Link href="/comunidade" className="ml-auto font-semibold hover:underline" style={{ color: "#0f62fe" }}>Limpar filtros</Link>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="bg-white border border-[#e0e0e0] p-12 text-center">
                <PenLine className="h-10 w-10 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
                <p className="text-base font-bold mb-1" style={{ color: "#161616" }}>
                  {q ? `Nenhum resultado para "${q}"` : tag ? `Nenhum post com "${tag}"` : "Ninguém publicou ainda."}
                </p>
                <p className="text-sm" style={{ color: "#8d8d8d" }}>
                  {q || tag ? "Tente outros termos ou navegue pelo feed." : "Seja o primeiro a compartilhar algo!"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-0 sm:gap-3">
                {serializedPosts.map((post) => (
                  <SocialPostCard key={post.id} post={post} currentUserId={session?.user?.id} />
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-[#e0e0e0] px-4 py-3">
                <span className="text-xs" style={{ color: "#8d8d8d" }}>
                  Página {pageNum} de {totalPages} · {totalPosts} posts
                </span>
                <div className="flex items-center gap-2">
                  {pageNum > 1 && (
                    <Link href={pageHref(pageNum - 1)} className="text-xs font-bold px-3 h-8 flex items-center border transition-colors hover:bg-[#f4f4f4]" style={{ borderColor: "#e0e0e0", color: "#525252" }}>
                      ← Anterior
                    </Link>
                  )}
                  {pageNum < totalPages && (
                    <Link href={pageHref(pageNum + 1)} className="text-xs font-bold px-3 h-8 flex items-center border transition-colors hover:bg-[#0353e9]" style={{ backgroundColor: "#0f62fe", borderColor: "#0f62fe", color: "#fff" }}>
                      Próxima →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* ── Sidebar Direita ── */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-3">
            {session && <UserSearchBox />}

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>Comunidade CFIA</p>
              <div className="space-y-2.5">
                {[
                  { icon: Users, label: "Membros", value: totalUsers.toLocaleString("pt-BR") },
                  { icon: PenLine, label: "Publicações", value: totalPosts.toLocaleString("pt-BR") },
                  { icon: Zap, label: "Sistema de XP", value: "Ativo", blue: true },
                ].map(({ icon: Icon, label, value, blue }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5" style={{ color: "#525252" }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} /> {label}
                    </span>
                    <span className="font-bold" style={{ color: blue ? "#0f62fe" : "#161616" }}>{value}</span>
                  </div>
                ))}
              </div>
              {!session && (
                <Link href="/cadastro" className="mt-4 flex items-center justify-center text-xs font-bold h-9 w-full transition-colors hover:bg-[#0353e9]" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
                  Participar da comunidade
                </Link>
              )}
            </div>

            {/* Tags dinâmicas */}
            {sortedTags.length > 0 && (
              <div className="bg-white border border-[#e0e0e0] p-4">
                <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>Tags populares</p>
                <div className="flex flex-wrap gap-1.5">
                  {sortedTags.map(([t, count]) => (
                    <Link key={t} href={`/comunidade?tag=${encodeURIComponent(t)}`}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 transition-colors hover:bg-[#0f62fe] hover:text-white"
                      style={{ backgroundColor: tag === t ? "#0f62fe" : "#edf5ff", color: tag === t ? "#fff" : "#0043ce" }}>
                      #{t}
                      <span className="font-normal text-[10px] opacity-70">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="bg-white border border-[#e0e0e0] p-4">
                <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>Pessoas que você pode conhecer</p>
                <div className="space-y-3">
                  {suggestions.map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <Link href={`/u/${u.id}`}>
                        <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 select-none hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
                          {u.name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") ?? "?"}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/u/${u.id}`} className="text-xs font-bold truncate block hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>{u.name}</Link>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>
                          {u.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"}{u._count.posts > 0 ? ` · ${u._count.posts} posts` : ""}
                        </p>
                      </div>
                      <SuggestConnectButtonClient toId={u.id} initialStatus={connMap.get(u.id) ?? "none"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>Regras da comunidade</p>
              <ol className="space-y-2 text-xs" style={{ color: "#525252" }}>
                {["Respeito acima de tudo", "Foco em programação e IA", "Sem spam ou autopromoção", "Compartilhe conteúdo real"].map((r, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="font-mono font-bold shrink-0" style={{ color: "#0f62fe" }}>{String(i + 1).padStart(2, "0")}</span>{r}
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
