"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ThumbsUp, MessageSquare, UserPlus, Send, Loader2, Check,
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

function Avatar({ name, size = 40 }: { name: string | null; size?: number }) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") ?? "?";
  return (
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
      {initials}
    </div>
  );
}

interface CommentInputProps {
  postId: string;
  authorName: string | null;
  onCommentAdded: (count: number) => void;
}

function CommentInput({ postId, authorName, onCommentAdded }: CommentInputProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
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
      setBody("");
      onCommentAdded(1);
      toast.success("Comentário publicado!");
    } catch {
      toast.error("Erro ao comentar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={session?.user?.name ?? null} size={32} />
      <div className="flex-1 flex items-center border border-[#e0e0e0] rounded-full overflow-hidden" style={{ backgroundColor: "#f4f4f4" }}>
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(); }}
          placeholder={`Comentar como ${session?.user?.name?.split(" ")[0] ?? "você"}...`}
          className="flex-1 h-9 px-4 text-sm bg-transparent focus:outline-none"
          style={{ color: "#161616" }}
        />
        <button
          onClick={submit}
          disabled={loading || !body.trim()}
          className="h-9 w-10 flex items-center justify-center disabled:opacity-40 transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
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

  const myVote = post.votes.find((v) => v.userId === (currentUserId ?? session?.user?.id));
  const likeCount = post.votes.filter((v) => v.value === 1).length;

  const [liked, setLiked] = useState(myVote?.value === 1);
  const [likes, setLikes] = useState(likeCount);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [connecting, setConnecting] = useState<"idle" | "loading" | "sent" | "connected">(() => {
    if (post.connectionStatus === "accepted") return "connected";
    if (post.connectionStatus === "pending") return "sent";
    return "idle";
  });

  const isOwnPost = session?.user?.id === post.author.id;

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

  async function connect() {
    if (!session) { router.push("/entrar"); return; }
    setConnecting("loading");
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId: post.author.id }),
    });
    if (res.ok) {
      setConnecting("sent");
      toast.success(`Pedido enviado para ${post.author.name?.split(" ")[0] ?? "usuário"}`);
    } else if (res.status === 409) {
      setConnecting("sent");
    } else {
      setConnecting("idle");
      toast.error("Não foi possível enviar o pedido");
    }
  }

  return (
    <article
      className="bg-white border border-[#e0e0e0] transition-shadow"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
    >
      {/* ── Cabeçalho do autor ── */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={post.author.name} size={42} />
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate" style={{ color: "#161616" }}>
              {post.author.name ?? "Anônimo"}
            </p>
            <p className="text-xs" style={{ color: "#8d8d8d" }}>
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Botão conectar — só aparece para posts de outros */}
        {session && !isOwnPost && (
          <div className="shrink-0">
            {connecting === "connected" ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 h-7" style={{ color: "#24a148" }}>
                <Check className="h-3 w-3" /> Conectado
              </span>
            ) : connecting === "sent" ? (
              <span className="flex items-center gap-1 text-xs px-2.5 h-7" style={{ color: "#8d8d8d" }}>
                <Check className="h-3 w-3" /> Solicitado
              </span>
            ) : (
              <button
                onClick={connect}
                disabled={connecting === "loading"}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 h-7 border transition-all hover:bg-[#0f62fe] hover:text-white hover:border-[#0f62fe] disabled:opacity-50"
                style={{ borderColor: "#0f62fe", color: "#0f62fe" }}
              >
                {connecting === "loading"
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><UserPlus className="h-3 w-3" /> Conectar</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Conteúdo principal — clicável ── */}
      <Link href={`/comunidade/${post.id}`} className="block px-4 pb-3 group">
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
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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
      </Link>

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
              onClick={() => setShowComments((v) => !v)}
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
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-semibold transition-colors hover:bg-[#f4f4f4]"
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
          onClick={() => setShowComments((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-semibold transition-colors hover:bg-[#f4f4f4]"
          style={{ color: showComments ? "#0f62fe" : "#525252" }}
        >
          <MessageSquare className="h-4 w-4" />
          Comentar
        </button>
      </div>

      {/* ── Área de comentários ── */}
      {showComments && (
        <div className="border-t" style={{ borderColor: "#e0e0e0" }}>
          <CommentInput
            postId={post.id}
            authorName={post.author.name}
            onCommentAdded={(n) => setCommentCount((prev) => prev + n)}
          />
        </div>
      )}
    </article>
  );
}
