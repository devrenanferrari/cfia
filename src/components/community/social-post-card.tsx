"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ThumbsUp, MessageSquare, Send, Loader2, CornerDownRight,
  ExternalLink, ChevronDown, Bookmark, BookmarkCheck,
  MoreHorizontal, Pencil, Trash2, Check, X,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

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
  savedByCurrentUser?: boolean;
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
  return name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") ?? "?";
}

function Avatar({ name, size = 40, href }: { name: string | null; size?: number; href?: string }) {
  const el = (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold select-none"
      style={{ width: size, height: size, backgroundColor: "#0f62fe", color: "#fff", fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
  if (href) return <Link href={href} onClick={(e) => e.stopPropagation()}>{el}</Link>;
  return el;
}

function CommentItem({
  comment, postId, currentUserId, onReplyAdded, onDeleted, depth = 0,
}: {
  comment: CommentData;
  postId: string;
  currentUserId?: string;
  onReplyAdded: (parentId: string, reply: CommentData) => void;
  onDeleted: (id: string, parentId?: string) => void;
  depth?: number;
}) {
  const { data: session } = useSession();
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [editLoading, setEditLoading] = useState(false);
  const [body, setBody] = useState(comment.body);
  const isOwn = session?.user?.id === comment.author.id;

  async function submitReply() {
    if (!replyBody.trim()) return;
    setReplyLoading(true);
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
    } catch { toast.error("Erro ao responder"); }
    finally { setReplyLoading(false); }
  }

  async function saveEdit() {
    if (!editBody.trim() || editBody === body) { setEditing(false); return; }
    setEditLoading(true);
    try {
      const res = await fetch(`/api/community/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao editar"); return; }
      setBody(editBody.trim());
      setEditing(false);
      toast.success("Comentário editado");
    } catch { toast.error("Erro ao editar"); }
    finally { setEditLoading(false); }
  }

  async function deleteComment() {
    if (!confirm("Deletar este comentário?")) return;
    try {
      const res = await fetch(`/api/community/comments/${comment.id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Erro ao deletar"); return; }
      onDeleted(comment.id);
      toast.success("Comentário removido");
    } catch { toast.error("Erro ao deletar"); }
  }

  return (
    <div className="flex gap-2.5">
      <Avatar name={comment.author.name} size={30} href={`/u/${comment.author.id}`} />
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl px-3 py-2" style={{ backgroundColor: "#f4f4f4" }}>
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <Link
              href={`/u/${comment.author.id}`}
              className="text-xs font-bold hover:text-[#0f62fe] transition-colors"
              style={{ color: "#161616" }}
              onClick={(e) => e.stopPropagation()}
            >
              {comment.author.name ?? "Anônimo"}
            </Link>
            {isOwn && !editing && (
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditing(true); setEditBody(body); }} className="p-1 rounded hover:bg-[#e0e0e0] transition-colors" title="Editar">
                  <Pencil className="h-3 w-3" style={{ color: "#8d8d8d" }} />
                </button>
                <button onClick={deleteComment} className="p-1 rounded hover:bg-[#e0e0e0] transition-colors" title="Deletar">
                  <Trash2 className="h-3 w-3" style={{ color: "#da1e28" }} />
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
                className="flex-1 text-sm bg-white border border-[#0f62fe] px-2 py-1 focus:outline-none"
                style={{ color: "#161616" }}
                autoFocus
              />
              <button onClick={saveEdit} disabled={editLoading} className="p-1 hover:text-[#0f62fe]">
                {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" style={{ color: "#24a148" }} />}
              </button>
              <button onClick={() => setEditing(false)} className="p-1">
                <X className="h-3.5 w-3.5" style={{ color: "#da1e28" }} />
              </button>
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "#393939" }}>{body}</p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 pl-1">
          <span className="text-[11px]" style={{ color: "#a8a8a8" }}>{timeAgo(comment.createdAt)}</span>
          {session && depth < 2 && (
            <button onClick={() => setReplying((v) => !v)} className="text-[11px] font-bold hover:text-[#0f62fe] transition-colors" style={{ color: "#8d8d8d" }}>
              Responder
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2 flex items-center gap-2">
            <Avatar name={session?.user?.name ?? null} size={24} />
            <div className="flex-1 flex items-center rounded-full overflow-hidden" style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}>
              <input
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
                placeholder="Escreva uma resposta..."
                className="flex-1 h-8 px-3 text-xs bg-transparent focus:outline-none"
                style={{ color: "#161616" }}
                autoFocus
              />
              <button onClick={submitReply} disabled={replyLoading || !replyBody.trim()} className="h-8 w-8 flex items-center justify-center disabled:opacity-40 hover:text-[#0f62fe] transition-colors" style={{ color: "#8d8d8d" }}>
                {replyLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2.5 space-y-2.5 pl-2 border-l-2" style={{ borderColor: "#e0e0e0" }}>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId}
                onReplyAdded={onReplyAdded} onDeleted={(rid) => onDeleted(rid, comment.id)} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialPostCard({ post, currentUserId }: { post: SocialPostData; currentUserId?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const myVote = post.votes.find((v) => v.userId === (currentUserId ?? session?.user?.id));
  const likeCount = post.votes.filter((v) => v.value === 1).length;

  const [liked, setLiked] = useState(myVote?.value === 1);
  const [likes, setLikes] = useState(likeCount);
  const [saved, setSaved] = useState(post.savedByCurrentUser ?? false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // edit post state
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body ?? "");
  const [editLoading, setEditLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(post.title);
  const [displayBody, setDisplayBody] = useState(post.body);

  const isOwnPost = session?.user?.id === post.author.id;

  async function loadComments() {
    if (comments !== null) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch { setComments([]); }
    finally { setCommentsLoading(false); }
  }

  function toggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next) { loadComments(); setTimeout(() => inputRef.current?.focus(), 100); }
  }

  async function toggleLike() {
    if (!session) { router.push("/entrar"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((p) => newLiked ? p + 1 : Math.max(0, p - 1));
    await fetch(`/api/community/posts/${post.id}/vote`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 1 }),
    });
  }

  async function toggleSave() {
    if (!session) { router.push("/entrar"); return; }
    const res = await fetch(`/api/community/posts/${post.id}/save`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
      toast.success(data.saved ? "Post salvo!" : "Post removido dos salvos");
    }
  }

  async function submitComment() {
    if (!session) { router.push("/entrar"); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao comentar"); return; }
      const comment = await res.json();
      setComments((p) => [...(p ?? []), { ...comment, replies: [] }]);
      setCommentCount((p) => p + 1);
      setNewComment("");
    } catch { toast.error("Erro ao comentar"); }
    finally { setSubmitting(false); }
  }

  function handleReplyAdded(parentId: string, reply: CommentData) {
    setComments((p) => p?.map((c) => c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c) ?? null);
  }

  function handleCommentDeleted(id: string, parentId?: string) {
    setComments((p) => {
      if (!p) return p;
      if (parentId) return p.map((c) => c.id === parentId ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== id) } : c);
      return p.filter((c) => c.id !== id);
    });
    setCommentCount((p) => Math.max(0, p - 1));
  }

  async function savePostEdit() {
    if (!editTitle.trim()) { toast.error("Título obrigatório"); return; }
    setEditLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() || null, tags: post.tags }),
      });
      if (!res.ok) { toast.error("Erro ao editar"); return; }
      setDisplayTitle(editTitle.trim());
      setDisplayBody(editBody.trim() || null);
      setEditing(false);
      setShowMenu(false);
      toast.success("Post editado!");
    } catch { toast.error("Erro ao editar"); }
    finally { setEditLoading(false); }
  }

  async function deletePost() {
    if (!confirm("Deletar este post permanentemente?")) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Erro ao deletar"); return; }
      setDeleted(true);
      toast.success("Post deletado");
    } catch { toast.error("Erro ao deletar"); }
  }

  if (deleted) return null;

  return (
    <article className="bg-white border border-[#e0e0e0]" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      {/* ── Cabeçalho ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Avatar name={post.author.name} size={42} href={`/u/${post.author.id}`} />
        <div className="flex-1 min-w-0">
          <Link href={`/u/${post.author.id}`} className="text-sm font-bold hover:text-[#0f62fe] transition-colors inline-block" style={{ color: "#161616" }}>
            {post.author.name ?? "Anônimo"}
          </Link>
          <p className="text-xs" style={{ color: "#8d8d8d" }}>{timeAgo(post.createdAt)}</p>
        </div>
        {isOwnPost && (
          <div className="relative">
            <button onClick={() => setShowMenu((v) => !v)} className="p-2 hover:bg-[#f4f4f4] transition-colors rounded" style={{ color: "#8d8d8d" }}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 z-20 bg-white border border-[#e0e0e0] shadow-lg min-w-[140px]" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                <button onClick={() => { setEditing(true); setShowMenu(false); setEditTitle(displayTitle); setEditBody(displayBody ?? ""); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[#f4f4f4] transition-colors text-left" style={{ color: "#525252" }}>
                  <Pencil className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} /> Editar post
                </button>
                <button onClick={deletePost}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-[#fff1f1] transition-colors text-left" style={{ color: "#da1e28" }}>
                  <Trash2 className="h-3.5 w-3.5" /> Deletar post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Conteúdo / Editor ── */}
      {editing ? (
        <div className="px-4 pb-3 space-y-2">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full font-bold text-base border-b-2 border-[#0f62fe] pb-1 focus:outline-none bg-transparent"
            style={{ color: "#161616" }}
            placeholder="Título do post"
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={4}
            className="w-full text-sm leading-relaxed resize-none focus:outline-none bg-[#f4f4f4] p-3"
            style={{ color: "#525252" }}
            placeholder="Conteúdo (markdown suportado)..."
          />
          <div className="flex gap-2 pt-1">
            <button onClick={savePostEdit} disabled={editLoading}
              className="flex items-center gap-1.5 px-4 h-8 text-xs font-bold text-white disabled:opacity-50 transition-colors hover:bg-[#0353e9]"
              style={{ backgroundColor: "#0f62fe" }}>
              {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> Salvar</>}
            </button>
            <button onClick={() => setEditing(false)} className="px-4 h-8 text-xs font-semibold border transition-colors hover:bg-[#f4f4f4]" style={{ borderColor: "#e0e0e0", color: "#525252" }}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-3">
          <Link href={`/comunidade/${post.id}`} className="block group">
            <h2 className="font-bold leading-snug mb-2 group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616", fontSize: "17px" }}>
              {displayTitle}
            </h2>
            {displayBody && (
              <div className="mb-3 line-clamp-4 text-sm leading-relaxed" style={{ color: "#525252" }}>
                {displayBody}
              </div>
            )}
          </Link>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/comunidade?tag=${encodeURIComponent(tag)}`}
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors hover:bg-[#0f62fe] hover:text-white"
                  style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Contadores ── */}
      {(likes > 0 || commentCount > 0) && (
        <div className="flex items-center gap-4 px-4 py-2 border-t text-xs" style={{ borderColor: "#f4f4f4", color: "#8d8d8d" }}>
          {likes > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white" style={{ backgroundColor: "#0f62fe", fontSize: "9px" }}>♥</span>
              {likes}
            </span>
          )}
          {commentCount > 0 && (
            <button onClick={toggleComments} className="ml-auto hover:underline hover:text-[#0f62fe] transition-colors">
              {commentCount} comentário{commentCount !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      {/* ── Barra de ações ── */}
      <div className="flex items-center border-t" style={{ borderColor: "#e0e0e0" }}>
        <button onClick={toggleLike}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: liked ? "#0f62fe" : "#525252" }}>
          <ThumbsUp className="h-4 w-4" style={{ fill: liked ? "#0f62fe" : "none", color: liked ? "#0f62fe" : "#525252" }} />
          {liked ? "Curtido" : "Curtir"}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

        <button onClick={toggleComments}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: showComments ? "#0f62fe" : "#525252" }}>
          <MessageSquare className="h-4 w-4" />
          <span>Comentar</span>
          {commentCount > 0 && (
            <ChevronDown className="h-3.5 w-3.5 transition-transform" style={{ transform: showComments ? "rotate(180deg)" : "none", color: showComments ? "#0f62fe" : "#8d8d8d" }} />
          )}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

        <button onClick={toggleSave}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: saved ? "#0f62fe" : "#525252" }}>
          {saved ? <BookmarkCheck className="h-4 w-4" style={{ fill: "#0f62fe", color: "#0f62fe" }} /> : <Bookmark className="h-4 w-4" />}
          {saved ? "Salvo" : "Salvar"}
        </button>

        <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

        <Link href={`/comunidade/${post.id}`}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: "#525252" }}>
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Ver post</span>
        </Link>
      </div>

      {/* ── Comentários ── */}
      {showComments && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: "#e0e0e0" }}>
          <div className="flex items-center gap-3">
            <Avatar name={session?.user?.name ?? null} size={32} />
            <div className="flex-1 flex items-center rounded-full overflow-hidden" style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}>
              <input
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submitComment(); }}
                placeholder={session ? `Comentar como ${session.user.name?.split(" ")[0]}...` : "Faça login para comentar"}
                readOnly={!session}
                onClick={() => { if (!session) router.push("/entrar"); }}
                className="flex-1 h-9 px-4 text-sm bg-transparent focus:outline-none"
                style={{ color: "#161616" }}
              />
              {session && (
                <button onClick={submitComment} disabled={submitting || !newComment.trim()}
                  className="h-9 w-10 flex items-center justify-center disabled:opacity-40 hover:text-[#0f62fe] transition-colors" style={{ color: "#8d8d8d" }}>
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </div>

          {commentsLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" style={{ color: "#8d8d8d" }} /></div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-3 pt-1">
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} postId={post.id} currentUserId={currentUserId}
                  onReplyAdded={handleReplyAdded} onDeleted={handleCommentDeleted} />
              ))}
              {commentCount > comments.length && (
                <Link href={`/comunidade/${post.id}`} className="flex items-center gap-1.5 text-xs font-bold mt-1 hover:underline" style={{ color: "#0f62fe" }}>
                  <CornerDownRight className="h-3 w-3" /> Ver todos os {commentCount} comentários
                </Link>
              )}
            </div>
          ) : comments !== null && comments.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: "#8d8d8d" }}>Nenhum comentário ainda. Seja o primeiro!</p>
          ) : null}
        </div>
      )}
    </article>
  );
}
