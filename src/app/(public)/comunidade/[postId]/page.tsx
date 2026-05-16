import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { VoteButtons } from "@/components/community/vote-buttons";
import { CommentSection } from "@/components/community/comment-section";
import { ConnectButtonClient } from "@/components/community/connect-button";

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.postId }, select: { title: true } });
  return { title: post ? `${post.title} | Comunidade CFIA` : "Post | Comunidade CFIA" };
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

export default async function PostPage({ params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: { select: { id: true, name: true, image: true } },
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

  return (
    <div className="bg-white min-h-screen">
      <section
        className="pt-16 pb-8 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: "#8d8d8d" }}
          >
            <ArrowLeft className="h-4 w-4" /> Comunidade
          </Link>
          <div className="flex items-start gap-4">
            <VoteButtons
              targetId={post.id}
              targetType="post"
              votes={post.votes}
              userId={session?.user?.id}
              vertical
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: "#c6c6c6" }}>
                  {post.author.name ?? "Anônimo"}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: "#8d8d8d" }}>
                  <Clock className="h-3 w-3" /> {timeAgo(post.createdAt)}
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 font-semibold uppercase tracking-widest"
                    style={{ backgroundColor: "#1d3461", color: "#7eb3ff" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1
                className="text-3xl md:text-4xl font-light leading-snug text-white"
                style={{ letterSpacing: "-0.01em" }}
              >
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            {post.body && (
              <div
                className="p-6 mb-8 border border-[#e0e0e0] text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "#525252" }}
              >
                {post.body}
              </div>
            )}

            <div className="border-t border-[#e0e0e0] pt-8">
              <h2 className="text-base font-semibold mb-6 flex items-center gap-2" style={{ color: "#161616" }}>
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
          </main>

          <aside className="lg:col-span-4">
            <div className="border border-[#e0e0e0] p-5 bg-white sticky top-20">
              <p className="text-[10px] uppercase tracking-widest mb-3 font-mono" style={{ color: "#8d8d8d" }}>
                Autor
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: "#edf5ff", color: "#0f62fe" }}
                >
                  {post.author.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#161616" }}>{post.author.name}</p>
                  <p className="text-xs" style={{ color: "#8d8d8d" }}>Membro CFIA</p>
                </div>
              </div>
              {session && session.user.id !== post.author.id && (
                <ConnectButtonClient toId={post.author.id} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
