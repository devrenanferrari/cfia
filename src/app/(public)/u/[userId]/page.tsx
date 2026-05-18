import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";
import { ConnectButtonClient } from "@/components/community/connect-button";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  return { title: user ? `${user.name} | CFIA` : "Perfil | CFIA" };
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "hoje";
  if (d < 7) return `${d}d atrás`;
  if (d < 30) return `${Math.floor(d / 7)}sem atrás`;
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function timeAgoShort(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  const [user, xpData, connectionCount, posts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        instructorBio: true,
        _count: { select: { posts: true } },
      },
    }),
    prisma.userXP.findUnique({ where: { userId } }),
    prisma.connection.count({
      where: {
        status: "ACCEPTED",
        OR: [{ fromId: userId }, { toId: userId }],
      },
    }),
    prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        createdAt: true,
        votes: { select: { value: true } },
        _count: { select: { comments: true } },
      },
    }),
  ]);

  if (!user) notFound();

  const isOwnProfile = session?.user?.id === userId;

  const existingConn =
    session && !isOwnProfile
      ? await prisma.connection.findFirst({
          where: {
            OR: [
              { fromId: session.user.id, toId: userId },
              { fromId: userId, toId: session.user.id },
            ],
          },
          select: { status: true },
        })
      : null;

  const connectionStatus = existingConn
    ? existingConn.status === "ACCEPTED"
      ? "accepted"
      : "pending"
    : "none";

  const xp = xpData?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const xpToNext = level * 100;
  const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") ?? "?";

  const bio = user.role === "INSTRUCTOR" ? user.instructorBio ?? user.bio : user.bio;

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[900px] px-4 py-6">
        <Link
          href="/comunidade"
          className="inline-flex items-center gap-2 text-sm mb-5 transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          <ArrowLeft className="h-4 w-4" /> Comunidade
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* ── Card de Perfil ── */}
          <aside className="md:col-span-4">
            <div className="bg-white border border-[#e0e0e0] overflow-hidden">
              {/* Banner */}
              <div className="relative h-24" style={{ backgroundColor: "#0f62fe" }}>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "10px 10px",
                  }}
                />
                <div
                  className="absolute -bottom-8 left-5 h-16 w-16 rounded-full border-4 border-white flex items-center justify-center font-bold text-xl select-none"
                  style={{ backgroundColor: "#161616", color: "#ffffff" }}
                >
                  {initials}
                </div>
              </div>

              <div className="pt-10 px-5 pb-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h1 className="text-base font-bold leading-tight" style={{ color: "#161616" }}>
                      {user.name ?? "Usuário"}
                    </h1>
                    <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>
                      {user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · CFIA
                    </p>
                  </div>
                  {session && !isOwnProfile && (
                    <ConnectButtonClient toId={userId} initialStatus={connectionStatus} />
                  )}
                  {isOwnProfile && (
                    <Link
                      href="/perfil"
                      className="text-xs px-3 h-7 flex items-center border transition-colors hover:bg-[#f4f4f4]"
                      style={{ borderColor: "#e0e0e0", color: "#525252" }}
                    >
                      Editar
                    </Link>
                  )}
                </div>

                {bio && (
                  <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: "#525252" }}>
                    {bio}
                  </p>
                )}

                {/* XP bar */}
                <div className="mt-3 mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold" style={{ color: "#0f62fe" }}>
                      Nível {level}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "#8d8d8d" }}>
                      {xp}/{xpToNext} XP
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#e0e0e0" }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${xpPct}%`, backgroundColor: "#0f62fe" }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div
                  className="grid grid-cols-3 gap-px border rounded-sm overflow-hidden"
                  style={{ borderColor: "#e0e0e0", backgroundColor: "#e0e0e0" }}
                >
                  <div className="bg-white py-3 text-center">
                    <p className="text-sm font-bold" style={{ color: "#161616" }}>
                      {connectionCount}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "#8d8d8d" }}>
                      Conexões
                    </p>
                  </div>
                  <div className="bg-white py-3 text-center">
                    <p className="text-sm font-bold" style={{ color: "#161616" }}>
                      {user._count.posts}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "#8d8d8d" }}>
                      Posts
                    </p>
                  </div>
                  <div className="bg-white py-3 text-center">
                    <p className="text-sm font-bold" style={{ color: "#0f62fe" }}>
                      {level}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "#8d8d8d" }}>
                      Nível
                    </p>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-1.5 mt-4 text-xs" style={{ color: "#8d8d8d" }}>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  Entrou {timeAgo(user.createdAt)}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Posts do usuário ── */}
          <main className="md:col-span-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "#8d8d8d" }}>
                Publicações de {user.name?.split(" ")[0]}
              </p>
              <span className="text-xs" style={{ color: "#8d8d8d" }}>
                {posts.length} post{posts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {posts.length === 0 ? (
              <div
                className="bg-white border border-[#e0e0e0] p-10 text-center"
              >
                <MessageSquare className="h-8 w-8 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
                <p className="text-sm font-bold mb-1" style={{ color: "#161616" }}>
                  Nenhum post ainda
                </p>
                <p className="text-xs" style={{ color: "#8d8d8d" }}>
                  {isOwnProfile ? "Compartilhe algo com a comunidade!" : "Este usuário ainda não publicou nada."}
                </p>
                {isOwnProfile && (
                  <Link
                    href="/comunidade"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 h-8 transition-colors hover:bg-[#0353e9]"
                    style={{ backgroundColor: "#0f62fe", color: "#fff" }}
                  >
                    Criar post →
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post) => {
                  const likeCount = post.votes.filter((v) => v.value === 1).length;
                  return (
                    <Link
                      key={post.id}
                      href={`/comunidade/${post.id}`}
                      className="block bg-white border border-[#e0e0e0] px-4 py-4 transition-all hover:border-[#0f62fe] group"
                      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                    >
                      <h2
                        className="font-bold leading-snug mb-1.5 group-hover:text-[#0f62fe] transition-colors"
                        style={{ color: "#161616", fontSize: "15px" }}
                      >
                        {post.title}
                      </h2>
                      {post.body && (
                        <p className="text-xs leading-relaxed line-clamp-2 mb-2.5" style={{ color: "#525252" }}>
                          {post.body}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs" style={{ color: "#8d8d8d" }}>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" style={{ color: "#0f62fe" }} />
                          {likeCount} curtida{likeCount !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post._count.comments} comentário{post._count.comments !== 1 ? "s" : ""}
                        </span>
                        <span className="ml-auto">{timeAgoShort(post.createdAt.toISOString())}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
