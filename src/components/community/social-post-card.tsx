"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ThumbsUp, MessageSquare, Send, Loader2,
  CornerDownRight, ExternalLink, ChevronDown,
} from "lucide-react";

type Author = { id: string; name: string | null; image: string | null };
type Vote = { value: number; userId: string };

export interface SocialPostData {
  id: string;
  title: string;
  body: string | null;
  tags: string[];
  createdAt: string;
  author: Author;
  votes: Vote[];
  _count: { comments: number };
  connectionStatus?: "none" | "pending" | "accepted";
}

interface CommentData {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
  votes: Vote[];
  replies?: CommentData[];
}

function timeAgo(dateStr: string) {
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

function initials(name: string | null) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") ?? "?"
  );
}

function Avatar({
  name,
  size = 40,
  href,
}: {
  name: string | null;
  size?: number;
  href?: string;
}) {
  const inner = (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: "#0f62fe",
        color: "#ffffff",
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
  if (href) {
    return (
      <Link href={href} onClick={(e) => e.stopPropagation()}>
        {inner}
      </Link>
    );
  }
  return inner;
}

function CommentItem({
  comment,
  postId,
  onReplyAdded,
  depth = 0,
}: {
  comment: CommentData;
  postId: string;
  onReplyAdded: (parentId: string, reply: CommentData) => void;
  depth?: number;
}) {
  const { data: session } = useSession();
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReply() {
    if (!replyBody.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim(), parentId: comment.id }),
      });
      if (!res.ok) { toast.error("Erro ao responder"); return; }
      const reply = await res.json();
      onReplyAdded(comment.id, { ...reply, replies: [] });
      setReplyBody("");
      setReplying(false);
    } catch {
      toast.error("Erro ao responder");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2.5">
      <Avatar name={comment.author.name} size={30} href={`/u/${comment.author.id}`} />
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl px-3 py-2" style={{ backgroundColor: "#f4f4f4" }}>
          <Link
            href={`/u/${comment.author.id}`}
            className="text-xs font-bold mb-0.5 inline-block hover:text-[#0f62fe] transition-colors"
            style={{ color: "#161616" }}
            onClick={(e) => e.stopPropagation()}
          >
            {comment.author.name ?? "Anônimo"}
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: "#393939" }}>
            {comment.body}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1 pl-1">
          <span className="text-[11px]" style={{ color: "#a8a8a8" }}>
            {timeAgo(comment.createdAt)}
          </span>
          {session && depth < 2 && (
            <button
              onClick={() => setReplying((v) => !v)}
              className="text-[11px] font-bold transition-colors hover:text-[#0f62fe]"
              style={{ color: "#8d8d8d" }}
            >
              Responder
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2 flex items-center gap-2">
            <Avatar name={session?.user?.name ?? null} size={24} />
            <div
              className="flex-1 flex items-center rounded-full overflow-hidden"
              style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
            >
              <input
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
                placeholder="Escreva uma resposta..."
                className="flex-1 h-8 px-3 text-xs bg-transparent focus:outline-none"
                style={{ color: "#161616" }}
                autoFocus
              />
              <button
                onClick={submitReply}
                disabled={loading || !replyBody.trim()}
                className="h-8 w-8 flex items-center justify-center disabled:opacity-40 hover:text-[#0f62fe] transition-colors"
                style={{ color: "#8d8d8d" }}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2.5 space-y-2.5 pl-2 border-l-2" style={{ borderColor: "#e0e0e0" }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onReplyAdded={onReplyAdded}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialPostCard({
  post,
  currentUserId,
}: {
  post: SocialPostData;
  currentUserId?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const myVote = post.votes.find((v) => v.userId === (currentUserId ?? session?.user?.id));
  const likeCount = post.votes.filter((v) => v.value === 1).length;

  const [liked, setLiked] = useState(myVote?.value === 1);
  const [likes, setLikes] = useState(likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    if (comments !== null) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }

  function toggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next) {
      loadComments();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function toggleLike() {
    if (!session) { router.push("/entrar"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => newLiked ? prev + 1 : Math.max(0, prev - 1));
    await fetch(`/api/community/posts/${post.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 1 }),
    });
  }

  async function submitComment() {
    if (!session) { router.push("/entrar"); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao comentar"); return; }
      const comment = await res.json();
      setComments((prev) => [...(prev ?? []), { ...comment, replies: [] }]);
      setCommentCount((prev) => prev + 1);
      setNewComment("");
    } catch {
      toast.error("Erro ao comentar");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReplyAdded(parentId: string, reply: CommentData) {
    setComments((prev) =>
      prev?.map((c) =>
        c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c
      ) ?? null
    );
  }

  const authorProfileUrl = `/u/${post.author.id}`;

  return (
    <article
      className="bg-white border border-[#e0e0e0] transition-shadow"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {/* ── Cabeçalho ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Avatar name={post.author.name} size={42} href={authorProfileUrl} />
        <div className="flex-1 min-w-0">
          <Link
            href={authorProfileUrl}
            className="text-sm font-bold leading-tight hover:text-[#0f62fe] transition-colors inline-block"
            style={{ color: "#161616" }}
          >
            {post.author.name ?? "Anônimo"}
          </Link>
          <p className="text-xs" style={{ color: "#8d8d8d" }}>
            {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="px-4 pb-3">
        <Link href={`/comunidade/${post.id}`} className="block group">
          <h2
            className="font-bold leading-snug mb-2 group-hover:text-[#0f62fe] transition-colors"
            style={{ color: "#161616", fontSize: "17px" }}
          >
            {post.title}
          </h2>
          {post.body && (
            <p className="text-sm leading-relaxed line-clamp-3 mb-3" style={{ color: "#525252" }}>
              {post.body}
            </p>
          )}
        </Link>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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

      {/* ── Contadores ── */}
      {(likes > 0 || commentCount > 0) && (
        <div
          className="flex items-center gap-4 px-4 py-2 border-t text-xs"
          style={{ borderColor: "#f4f4f4", color: "#8d8d8d" }}
        >
          {likes > 0 && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white"
                style={{ backgroundColor: "#0f62fe", fontSize: "9px" }}
              >
                ♥
              </span>
              {likes}
            </span>
          )}
          {commentCount > 0 && (
            <button
              onClick={toggleComments}
              className="ml-auto hover:underline transition-colors hover:text-[#0f62fe]"
            >
              {commentCount} comentário{commentCount !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      {/* ── Barra de ações ── */}
      <div className="flex items-center border-t" style={{ borderColor: "#e0e0e0" }}>
        <button
          onClick={toggleLike}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: liked ? "#0f62fe" : "#525252" }}
        >
          <ThumbsUp
            className="h-4 w-4"
            style={{ fill: liked ? "#0f62fe" : "none", color: liked ? "#0f62fe" : "#525252" }}
          />
          {liked ? "Curtido" : "Curtir"}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

        <button
          onClick={toggleComments}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: showComments ? "#0f62fe" : "#525252" }}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comentar</span>
          {commentCount > 0 && (
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform"
              style={{
                transform: showComments ? "rotate(180deg)" : "rotate(0deg)",
                color: showComments ? "#0f62fe" : "#8d8d8d",
              }}
            />
          )}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

        <Link
          href={`/comunidade/${post.id}`}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: "#525252" }}
        >
          <ExternalLink className="h-4 w-4" />
          Ver post
        </Link>
      </div>

      {/* ── Seção de comentários ── */}
      {showComments && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "#e0e0e0" }}>
          {/* Input novo comentário */}
          <div className="flex items-center gap-3">
            <Avatar name={session?.user?.name ?? null} size={32} />
            <div
              className="flex-1 flex items-center rounded-full overflow-hidden"
              style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
            >
              <input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submitComment(); }}
                placeholder={
                  session
                    ? `Comentar como ${session.user.name?.split(" ")[0]}...`
                    : "Faça login para comentar"
                }
                readOnly={!session}
                onClick={() => { if (!session) router.push("/entrar"); }}
                className="flex-1 h-9 px-4 text-sm bg-transparent focus:outline-none"
                style={{ color: "#161616" }}
              />
              {session && (
                <button
                  onClick={submitComment}
                  disabled={submitting || !newComment.trim()}
                  className="h-9 w-10 flex items-center justify-center disabled:opacity-40 hover:text-[#0f62fe] transition-colors"
                  style={{ color: "#8d8d8d" }}
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Lista de comentários */}
          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#8d8d8d" }} />
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-3 pt-1">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  postId={post.id}
                  onReplyAdded={handleReplyAdded}
                />
              ))}
              {commentCount > comments.length && (
                <Link
                  href={`/comunidade/${post.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold mt-1 hover:underline"
                  style={{ color: "#0f62fe" }}
                >
                  <CornerDownRight className="h-3 w-3" />
                  Ver todos os {commentCount} comentários
                </Link>
              )}
            </div>
          ) : comments !== null && comments.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: "#8d8d8d" }}>
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : null}
        </div>
      )}
    </article>
  );
}
