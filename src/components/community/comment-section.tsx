"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, ArrowRight, CornerDownRight } from "lucide-react";
import { VoteButtons } from "./vote-buttons";

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

function CommentItem({
  comment,
  postId,
  currentUserId,
  onReplyAdded,
}: {
  comment: CommentData;
  postId: string;
  currentUserId?: string;
  onReplyAdded: (parentId: string, reply: CommentData) => void;
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
      onReplyAdded(comment.id, reply);
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
      <div className="flex flex-col items-center pt-1">
        <VoteButtons
          targetId={comment.id}
          targetType="comment"
          votes={comment.votes}
          userId={currentUserId}
          vertical
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold" style={{ color: "#161616" }}>
            {comment.author.name ?? "Anônimo"}
          </span>
          <span className="text-xs" style={{ color: "#8d8d8d" }}>{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{comment.body}</p>
        {session && (
          <button
            onClick={() => setReplying((v) => !v)}
            className="mt-2 text-xs flex items-center gap-1 hover:text-[#0f62fe] transition-colors"
            style={{ color: "#8d8d8d" }}
          >
            <CornerDownRight className="h-3 w-3" /> Responder
          </button>
        )}
        {replying && (
          <div className="mt-2 flex gap-2">
            <input
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 h-9 px-3 border border-[#e0e0e0] text-sm focus:outline-none focus:border-[#0f62fe]"
              style={{ color: "#161616" }}
              onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
            />
            <button
              onClick={submitReply}
              disabled={loading}
              className="h-9 px-4 text-xs font-semibold flex items-center gap-1"
              style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-[#e0e0e0] space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                onReplyAdded={onReplyAdded}
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
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    if (!body.trim()) return;
    if (!session) { toast.error("Faça login para comentar"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao comentar"); return; }
      const comment = await res.json();
      setComments((prev) => [{ ...comment, replies: [] }, ...prev]);
      setBody("");
    } catch {
      toast.error("Erro ao comentar");
    } finally {
      setLoading(false);
    }
  }

  function handleReplyAdded(parentId: string, reply: CommentData) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : c
      )
    );
  }

  return (
    <div>
      {session ? (
        <div className="flex gap-2 mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="flex-1 px-4 py-3 border border-[#e0e0e0] text-sm resize-none focus:outline-none focus:border-[#0f62fe] leading-relaxed"
            style={{ color: "#161616" }}
          />
          <button
            onClick={submitComment}
            disabled={loading || !body.trim()}
            className="px-5 flex flex-col items-center justify-center gap-1 text-xs font-semibold disabled:opacity-50"
            style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      ) : (
        <p className="mb-6 text-sm" style={{ color: "#525252" }}>
          <a href="/entrar" style={{ color: "#0f62fe" }} className="font-semibold hover:underline">Faça login</a> para comentar.
        </p>
      )}

      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "#8d8d8d" }}>
            Nenhum comentário ainda. Seja o primeiro!
          </p>
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
