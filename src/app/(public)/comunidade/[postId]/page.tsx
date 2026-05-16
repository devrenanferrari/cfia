import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare } from "lucide-react";
import { CommentSection } from "@/components/community/comment-section";
import { ConnectButtonClient } from "@/components/community/connect-button";
import { PostActionBar } from "@/components/community/post-action-bar";
import { QuickChatButton } from "@/components/community/quick-chat-button";

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
  return `${Math.floor(h / 24)}d atrás`;
}

export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: postId },
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

  const likeCount = post.votes.filter((v) => v.value === 1).length;
  const myVote = post.votes.find((v) => v.userId === session?.user?.id);

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <Link
          href="/comunidade"
          className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          <ArrowLeft className="h-4 w-4" /> Comunidade
        </Link>

        {/* Card do post */}
        <div className="bg-white border border-[#e0e0e0] mb-3">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
            <div className="flex items-start gap-3">
              <div
                className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-base shrink-0"
                style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
              >
                {post.author.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#161616" }}>
                  {post.author.name ?? "Anônimo"}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: "#8d8d8d" }}>
                  <Clock className="h-3 w-3" /> {timeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            {session && session.user.id !== post.author.id && (
              <div className="flex gap-2">
                <ConnectButtonClient toId={post.author.id} />
                <QuickChatButton toId={post.author.id} />
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="px-5 pb-4">
            <h1 className="text-xl font-bold mb-3 leading-snug" style={{ color: "#161616" }}>
              {post.title}
            </h1>
            {post.body && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#525252" }}>
                {post.body}
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Contadores */}
          {(likeCount > 0 || post._count.comments > 0) && (
            <div className="flex items-center gap-3 px-5 py-2 border-t border-[#f4f4f4] text-xs" style={{ color: "#8d8d8d" }}>
              {likeCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px]" style={{ backgroundColor: "#0f62fe" }}>♥</span>
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
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#161616" }}>
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
    </div>
  );
}
