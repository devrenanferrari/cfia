"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Send, CornerDownRight } from "lucide-react";

type Author = { id: string; name: string | null; image: string | null };
type Vote = { value: number; userId: string };

export interface CommentData {
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
  return `${Math.floor(h / 24)}d`;
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

function Avatar({ name, size = 36, href }: { name: string | null; size?: number; href?: string }) {
  const el = (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: "#0f62fe",
        color: "#fff",
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
  if (href) return <Link href={href}>{el}</Link>;
  return el;
}

function CommentItem({
  comment,
  postId,
  currentUserId,
  onReplyAdded,
  depth = 0,
}: {
  comment: CommentData;
  postId: string;
  currentUserId?: string;
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
    <div className="flex gap-3">
      <Avatar name={comment.author.name} size={34} href={`/u/${comment.author.id}`} />
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl px-3.5 py-2.5"
          style={{ backgroundColor: "#f4f4f4" }}
        >
          <Link
            href={`/u/${comment.author.id}`}
            className="text-xs font-bold inline-block mb-0.5 hover:text-[#0f62fe] transition-colors"
            style={{ color: "#161616" }}
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
              className="text-[11px] font-bold transition-colors hover:text-[#0f62fe] flex items-center gap-1"
              style={{ color: "#8d8d8d" }}
            >
              <CornerDownRight className="h-3 w-3" /> Responder
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2 flex items-center gap-2">
            <Avatar name={session?.user?.name ?? null} size={26} />
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
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 space-y-3" style={{ borderColor: "#e0e0e0" }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
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

export function CommentSection({
  postId,
  initialComments,
  currentUserId,
}: {
  postId: string;
  initialComments: CommentData[];
  currentUserId?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    if (!session) { router.push("/entrar"); return; }
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao comentar"); return; }
      const comment = await res.json();
      setComments((prev) => [...prev, { ...comment, replies: [] }]);
      setBody("");
      toast.success("Comentário publicado!");
    } catch {
      toast.error("Erro ao comentar");
    } finally {
      setLoading(false);
    }
  }

  function handleReplyAdded(parentId: string, reply: CommentData) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c
      )
    );
  }

  return (
    <div>
      {/* Input de comentário */}
      <div className="flex gap-3 mb-6">
        <Avatar name={session?.user?.name ?? null} size={36} />
        <div className="flex-1">
          <div
            className="flex items-end rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
          >
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) submitComment();
              }}
              placeholder={
                session
                  ? `Comentar como ${session.user.name?.split(" ")[0]}... (Ctrl+Enter para enviar)`
                  : "Faça login para comentar"
              }
              readOnly={!session}
              onClick={() => { if (!session) router.push("/entrar"); }}
              rows={2}
              className="flex-1 px-4 py-3 text-sm bg-transparent resize-none focus:outline-none leading-relaxed"
              style={{ color: "#161616" }}
            />
            {session && (
              <button
                onClick={submitComment}
                disabled={loading || !body.trim()}
                className="m-2 h-8 w-8 flex items-center justify-center rounded-full disabled:opacity-40 transition-colors hover:opacity-80"
                style={{ backgroundColor: body.trim() ? "#0f62fe" : "#c6c6c6" }}
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5 text-white" />
                )}
              </button>
            )}
          </div>
          {!session && (
            <p className="mt-1.5 text-xs" style={{ color: "#8d8d8d" }}>
              <Link href="/entrar" className="font-bold hover:underline" style={{ color: "#0f62fe" }}>
                Faça login
              </Link>{" "}
              para participar da discussão.
            </p>
          )}
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm mb-1 font-bold" style={{ color: "#161616" }}>
              Nenhum comentário ainda
            </p>
            <p className="text-xs" style={{ color: "#8d8d8d" }}>
              Seja o primeiro a comentar neste post!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              onReplyAdded={handleReplyAdded}
            />
          ))
        )}
      </div>
    </div>
  );
}
