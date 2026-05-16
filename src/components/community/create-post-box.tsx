"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, X } from "lucide-react";

const TAGS = ["Python", "JavaScript", "IA", "Algoritmos", "ML", "Web", "SQL", "Dúvida", "Projeto"];

export function CreatePostBox() {
  const { data: session } = useSession();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const letter = session?.user?.name?.[0]?.toUpperCase() ?? "?";

  function handleBoxClick() {
    if (!session) { router.push("/entrar?callbackUrl=/comunidade"); return; }
    setExpanded(true);
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 4)
    );
  }

  async function submit() {
    if (!title.trim()) { toast.error("Escreva um título"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() || null, tags }),
      });
      if (!res.ok) { toast.error("Erro ao publicar"); return; }
      const post = await res.json();
      toast.success("Post publicado!");
      router.push(`/comunidade/${post.id}`);
    } catch {
      toast.error("Erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!expanded) {
    return (
      <div className="bg-white border border-[#e0e0e0] p-4 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
        >
          {session ? letter : "?"}
        </div>
        <button
          onClick={handleBoxClick}
          className="flex-1 h-10 rounded-full border border-[#e0e0e0] text-left px-4 text-sm transition-colors hover:border-[#8d8d8d] hover:bg-[#f4f4f4]"
          style={{ color: "#8d8d8d" }}
        >
          {session
            ? `No que você está pensando, ${session.user?.name?.split(" ")[0]}?`
            : "Entre para compartilhar algo com a comunidade..."}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#0f62fe] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#161616" }}>Criar publicação</p>
        <button onClick={() => setExpanded(false)}>
          <X className="h-4 w-4" style={{ color: "#8d8d8d" }} />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da sua publicação..."
        autoFocus
        maxLength={200}
        className="w-full border-b border-[#e0e0e0] pb-2 text-sm font-semibold focus:outline-none focus:border-[#0f62fe]"
        style={{ color: "#161616" }}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Compartilhe mais detalhes, código, links ou contexto... (opcional)"
        rows={3}
        className="w-full text-sm leading-relaxed resize-none focus:outline-none"
        style={{ color: "#525252" }}
      />

      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className="text-xs px-2.5 py-0.5 rounded-full border transition-colors font-medium"
            style={{
              backgroundColor: tags.includes(tag) ? "#0f62fe" : "transparent",
              color: tags.includes(tag) ? "#ffffff" : "#8d8d8d",
              borderColor: tags.includes(tag) ? "#0f62fe" : "#e0e0e0",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={submit}
          disabled={loading || !title.trim()}
          className="h-9 px-6 flex items-center gap-2 text-sm font-semibold disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Publicar <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}
