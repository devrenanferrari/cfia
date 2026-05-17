"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, MessageSquare, UserPlus, Clock, Send, Loader2, Check } from "lucide-react";
import { QuickChatButton } from "@/components/community/quick-chat-button";

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
  const letter = name?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: "#0f62fe",
        color: "#ffffff",
        fontSize: size * 0.38,
      }}
    >
      {letter}
    </div>
  );
}

interface CommentInputProps {
  postId: string;
  onCommentAdded: (count: number) => void;
}

function CommentInput({ postId, onCommentAdded }: CommentInputProps) {
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
    } catch {
      toast.error("Erro ao comentar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      <Avatar name={session?.user?.name ?? null} size={32} />
      <div className="flex-1 flex items-center border border-[#e0e0e0] rounded-full overflow-hidden bg-[#f4f4f4]">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Escreva um comentário..."
          className="flex-1 h-8 px-4 text-sm bg-transparent focus:outline-none"
          style={{ color: "#161616" }}
        />
        <button
          onClick={submit}
          disabled={loading || !body.trim()}
          className="h-8 w-9 flex items-center justify-center disabled:opacity-40 transition-colors hover:text-[#0f62fe]"
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

  const isOwnPost = session?.user?.id === post.author.id;

  return (
    <div
      className="bg-white border border-[#e0e0e0] overflow-hidden transition-shadow"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar name={post.author.name} size={44} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate" style={{ color: "#161616" }}>
              {post.author.name ?? "Anônimo"}
            </p>
            <p className="text-xs flex items-center gap-1" style={{ color: "#8d8d8d" }}>
              <Clock className="h-3 w-3 shrink-0" />
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {session && !isOwnPost && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:flex">
              <QuickChatButton toId={post.author.id} />
            </span>

            {connecting === "connected" ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-3 h-7 border" style={{ borderColor: "#24a148", color: "#24a148" }}>
                <Check className="h-3 w-3" /> Conectado
              </span>
            ) : connecting === "sent" ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-3 h-7 border" style={{ borderColor: "#c6c6c6", color: "#8d8d8d" }}>
                <Check className="h-3 w-3" /> Solicitado
              </span>
            ) : (
              <button
                onClick={connect}
                disabled={connecting === "loading"}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 h-7 border transition-colors disabled:opacity-60"
                style={{ borderColor: "#0f62fe", color: "#0f62fe" }}
              >
                {connecting === "loading" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <><UserPlus className="h-3 w-3" /> Conectar</>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="px-4 pb-3">
        <Link href={`/comunidade/${post.id}`} className="group">
          <h2
            className="text-base font-semibold leading-snug mb-1.5 group-hover:text-[#0f62fe] transition-colors"
            style={{ color: "#161616" }}
          >
            {post.title}
          </h2>
          {post.body && (
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#525252" }}>
              {post.body}
            </p>
          )}
        </Link>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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
      {(likes > 0 || commentCount > 0) && (
        <div className="flex items-center gap-3 px-4 py-2 border-t border-[#f4f4f4] text-xs" style={{ color: "#8d8d8d" }}>
          {likes > 0 && (
            <span className="flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px]" style={{ backgroundColor: "#0f62fe" }}>
                ♥
              </span>
              {likes}
            </span>
          )}
          {commentCount > 0 && (
            <button
              onClick={() => setShowComments((v) => !v)}
              className="ml-auto hover:underline"
            >
              {commentCount} comentário{commentCount !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      {/* Barra de ações — 2 botões, mais espaço em mobile */}
      <div className="flex items-center border-t border-[#e0e0e0] px-2">
        <button
          onClick={toggleLike}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-medium transition-colors hover:bg-[#f4f4f4]"
          style={{ color: liked ? "#0f62fe" : "#525252" }}
        >
          <Heart
            className="h-4 w-4"
            style={{ fill: liked ? "#0f62fe" : "none", color: liked ? "#0f62fe" : "#525252" }}
          />
          Curtir
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-medium transition-colors hover:bg-[#f4f4f4]"
          style={{ color: showComments ? "#0f62fe" : "#525252" }}
        >
          <MessageSquare className="h-4 w-4" />
          Comentar
        </button>
      </div>

      {/* Área de comentários */}
      {showComments && (
        <div className="border-t border-[#e0e0e0] pt-3">
          <CommentInput
            postId={post.id}
            onCommentAdded={(n) => setCommentCount((prev) => prev + n)}
          />
        </div>
      )}
    </div>
  );
}
