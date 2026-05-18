import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, Tag, TrendingUp, Users } from "lucide-react";
import { CommentSection } from "@/components/community/comment-section";
import { ConnectButtonClient } from "@/components/community/connect-button";
import { PostActionBar } from "@/components/community/post-action-bar";

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { title: true } });
  return { title: post ? `${post.title} | Comunidade CFIA` : "Post | Comunidade CFIA" };
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(name: string | null | undefined) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") ?? "?"
  );
}

export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true, role: true } },
      votes: { select: { value: true, userId: true } },
      _count: { select: { comments: true } },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          votes: { select: { value: true, userId: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, image: true } },
              votes: { select: { value: true, userId: true } },
            },
          },
        },
      },
    },
  });

  if (!post) notFound();

  const likeCount = post.votes.filter((v) => v.value === 1).length;
  const myVote = post.votes.find((v) => v.userId === session?.user?.id);

  const [existingConn, authorPostCount, authorXP] = await Promise.all([
    session && session.user.id !== post.author.id
      ? prisma.connection.findFirst({
          where: {
            OR: [
              { fromId: session.user.id, toId: post.author.id },
              { fromId: post.author.id, toId: session.user.id },
            ],
          },
          select: { status: true },
        })
      : null,
    prisma.post.count({ where: { authorId: post.author.id } }),
    prisma.userXP.findUnique({ where: { userId: post.author.id } }),
  ]);

  const connectionStatus = existingConn
    ? existingConn.status === "ACCEPTED"
      ? "accepted"
      : "pending"
    : "none";

  const authorLevel = authorXP ? Math.floor(authorXP.xp / 100) + 1 : 1;

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1100px] px-4 py-6">

        <Link
          href="/comunidade"
          className="inline-flex items-center gap-2 text-sm mb-5 transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          <ArrowLeft className="h-4 w-4" /> Comunidade
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── Post principal ── */}
          <div className="lg:col-span-8 space-y-3">

            {/* Card do post */}
            <div className="bg-white border border-[#e0e0e0]">
              {/* Cabeçalho do autor */}
              <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
                <Link href={`/u/${post.author.id}`} className="flex items-center gap-3 group min-w-0">
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 group-hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                  >
                    {initials(post.author.name)}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold leading-tight group-hover:text-[#0f62fe] transition-colors truncate"
                      style={{ color: "#161616" }}
                    >
                      {post.author.name ?? "Anônimo"}
                    </p>
                    <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: "#8d8d8d" }}>
                      <Clock className="h-3 w-3" />
                      {timeAgo(post.createdAt)}
                    </p>
                  </div>
                </Link>
                {session && session.user.id !== post.author.id && (
                  <ConnectButtonClient toId={post.author.id} initialStatus={connectionStatus} />
                )}
              </div>

              {/* Conteúdo */}
              <div className="px-5 pb-4">
                <h1
                  className="text-xl font-bold mb-3 leading-snug"
                  style={{ color: "#161616" }}
                >
                  {post.title}
                </h1>
                {post.body && (
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: "#393939" }}
                  >
                    {post.body}
                  </div>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/comunidade?tag=${encodeURIComponent(tag)}`}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors hover:bg-[#0f62fe] hover:text-white"
                        style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contadores */}
              {(likeCount > 0 || post._count.comments > 0) && (
                <div
                  className="flex items-center gap-3 px-5 py-2 border-t border-[#f4f4f4] text-xs"
                  style={{ color: "#8d8d8d" }}
                >
                  {likeCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px]"
                        style={{ backgroundColor: "#0f62fe" }}
                      >
                        ♥
                      </span>
                      {likeCount}
                    </span>
                  )}
                  {post._count.comments > 0 && (
                    <span className="ml-auto">
                      {post._count.comments} comentário{post._count.comments !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {/* Ações */}
              <PostActionBar
                postId={post.id}
                initialLiked={myVote?.value === 1}
                initialLikes={likeCount}
              />
            </div>

            {/* Comentários */}
            <div className="bg-white border border-[#e0e0e0] p-5">
              <h2
                className="text-sm font-bold mb-5 flex items-center gap-2"
                style={{ color: "#161616" }}
              >
                <MessageSquare className="h-4 w-4" style={{ color: "#0f62fe" }} />
                {post._count.comments} comentário{post._count.comments !== 1 ? "s" : ""}
              </h2>
              <CommentSection
                postId={post.id}
                initialComments={post.comments.map((c) => ({
                  ...c,
                  createdAt: c.createdAt.toISOString(),
                  replies: c.replies?.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
                }))}
                currentUserId={session?.user?.id}
              />
            </div>
          </div>

          {/* ── Sidebar: Sobre o autor ── */}
          <aside className="lg:col-span-4 space-y-3">

            {/* Card do autor */}
            <div className="bg-white border border-[#e0e0e0] overflow-hidden">
              <div className="h-14" style={{ backgroundColor: "#0f62fe" }}>
                <div
                  className="h-full opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "10px 10px",
                  }}
                />
              </div>
              <div className="px-4 pb-4">
                <Link href={`/u/${post.author.id}`} className="block group -mt-6 mb-3">
                  <div
                    className="h-12 w-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-base group-hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#161616", color: "#ffffff" }}
                  >
                    {initials(post.author.name)}
                  </div>
                </Link>
                <Link
                  href={`/u/${post.author.id}`}
                  className="font-bold text-sm hover:text-[#0f62fe] transition-colors inline-block"
                  style={{ color: "#161616" }}
                >
                  {post.author.name ?? "Anônimo"}
                </Link>
                <p className="text-xs mt-0.5 mb-3" style={{ color: "#8d8d8d" }}>
                  {post.author.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · Nível {authorLevel}
                </p>
                {post.author.bio && (
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#525252" }}>
                    {post.author.bio}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-px border rounded-sm overflow-hidden mb-3" style={{ borderColor: "#e0e0e0", backgroundColor: "#e0e0e0" }}>
                  <div className="bg-white py-2 text-center">
                    <p className="text-sm font-bold" style={{ color: "#161616" }}>{authorPostCount}</p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8d8d8d" }}>Posts</p>
                  </div>
                  <div className="bg-white py-2 text-center">
                    <p className="text-sm font-bold" style={{ color: "#0f62fe" }}>{authorLevel}</p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: "#8d8d8d" }}>Nível</p>
                  </div>
                </div>
                <Link
                  href={`/u/${post.author.id}`}
                  className="flex items-center justify-center gap-1.5 text-xs font-bold h-8 w-full border transition-colors hover:bg-[#f4f4f4]"
                  style={{ borderColor: "#e0e0e0", color: "#525252" }}
                >
                  <Users className="h-3.5 w-3.5" />
                  Ver perfil
                </Link>
              </div>
            </div>

            {/* Tags do post */}
            {post.tags.length > 0 && (
              <div className="bg-white border border-[#e0e0e0] p-4">
                <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: "#8d8d8d" }}>
                  <Tag className="h-3 w-3 inline mr-1" />
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/comunidade?tag=${encodeURIComponent(tag)}`}
                      className="text-xs font-bold px-3 py-1.5 transition-colors hover:bg-[#0f62fe] hover:text-white"
                      style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Links rápidos */}
            <div className="bg-white border border-[#e0e0e0] p-4">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-2" style={{ color: "#8d8d8d" }}>
                Explorar
              </p>
              <div className="space-y-0.5">
                {[
                  { href: "/comunidade", label: "Feed da comunidade", icon: Users },
                  { href: "/trilhas", label: "Trilhas de carreira", icon: TrendingUp },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 text-xs px-2 py-2 hover:bg-[#f4f4f4] transition-colors"
                    style={{ color: "#525252" }}
                  >
                    <Icon className="h-3 w-3 shrink-0" style={{ color: "#0f62fe" }} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
