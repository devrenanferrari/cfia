"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, MessageSquare, Bookmark, BookmarkCheck, Trash2, Pencil, Loader2 } from "lucide-react";

interface PostActionBarProps {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
  initialSaved?: boolean;
  isOwn?: boolean;
}

export function PostActionBar({ postId, initialLiked, initialLikes, initialSaved = false, isOwn = false }: PostActionBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(initialSaved);
  const [deleting, setDeleting] = useState(false);

  async function toggleLike() {
    if (!session) { router.push("/entrar"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((p) => newLiked ? p + 1 : Math.max(0, p - 1));
    await fetch(`/api/community/posts/${postId}/vote`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: 1 }),
    });
  }

  async function toggleSave() {
    if (!session) { router.push("/entrar"); return; }
    const res = await fetch(`/api/community/posts/${postId}/save`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
      toast.success(data.saved ? "Post salvo!" : "Removido dos salvos");
    }
  }

  async function deletePost() {
    if (!confirm("Deletar este post permanentemente?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) { toast.error("Erro ao deletar"); return; }
      toast.success("Post deletado");
      router.push("/comunidade");
      router.refresh();
    } catch { toast.error("Erro ao deletar"); }
    finally { setDeleting(false); }
  }

  function scrollToComments() {
    document.querySelector("textarea")?.focus();
  }

  return (
    <div className="flex items-center border-t border-[#e0e0e0]">
      <button onClick={toggleLike}
        className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
        style={{ color: liked ? "#0f62fe" : "#525252" }}>
        <Heart className="h-4 w-4" style={{ fill: liked ? "#0f62fe" : "none", color: liked ? "#0f62fe" : "#525252" }} />
        Curtir{likes > 0 ? ` · ${likes}` : ""}
      </button>

      <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

      <button onClick={scrollToComments}
        className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
        style={{ color: "#525252" }}>
        <MessageSquare className="h-4 w-4" />
        Comentar
      </button>

      <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />

      <button onClick={toggleSave}
        className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
        style={{ color: saved ? "#0f62fe" : "#525252" }}>
        {saved ? <BookmarkCheck className="h-4 w-4" style={{ fill: "#0f62fe", color: "#0f62fe" }} /> : <Bookmark className="h-4 w-4" />}
        {saved ? "Salvo" : "Salvar"}
      </button>

      {isOwn && (
        <>
          <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />
          <button onClick={() => router.push(`/comunidade/${postId}/editar`)}
            className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#f4f4f4]"
            style={{ color: "#525252" }}>
            <Pencil className="h-4 w-4" /> Editar
          </button>
          <div className="w-px h-5" style={{ backgroundColor: "#e0e0e0" }} />
          <button onClick={deletePost} disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 h-10 text-sm font-bold transition-colors hover:bg-[#fff1f1] disabled:opacity-50"
            style={{ color: "#da1e28" }}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Deletar
          </button>
        </>
      )}
    </div>
  );
}
