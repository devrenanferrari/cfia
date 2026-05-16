"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, X } from "lucide-react";

const SUGGESTED_TAGS = ["Python", "JavaScript", "IA", "Algoritmos", "ML", "Web", "SQL", "Dúvida", "Projeto", "Recurso"];

export function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 5)
    );
  }

  function addCustomTag() {
    const t = customTag.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
      setCustomTag("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título é obrigatório"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() || null, tags }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Erro ao publicar");
        return;
      }
      const post = await res.json();
      toast.success("Post publicado!");
      router.push(`/comunidade/${post.id}`);
    } catch {
      toast.error("Erro ao publicar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#525252" }}>
          Título *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Como vocês estão usando IA nos seus projetos?"
          maxLength={200}
          required
          className="w-full h-12 px-4 border border-[#e0e0e0] text-sm focus:outline-none focus:border-[#0f62fe]"
          style={{ color: "#161616" }}
        />
        <p className="text-[11px] text-right" style={{ color: "#8d8d8d" }}>{title.length}/200</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#525252" }}>
          Conteúdo (opcional)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Compartilhe mais detalhes, código, links ou contexto..."
          rows={6}
          className="w-full px-4 py-3 border border-[#e0e0e0] text-sm resize-y focus:outline-none focus:border-[#0f62fe] leading-relaxed"
          style={{ color: "#161616", minHeight: 120 }}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#525252" }}>
          Tags (até 5)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="text-xs px-3 py-1 border transition-colors font-semibold"
              style={{
                backgroundColor: tags.includes(tag) ? "#0f62fe" : "#f4f4f4",
                color: tags.includes(tag) ? "#ffffff" : "#525252",
                borderColor: tags.includes(tag) ? "#0f62fe" : "#e0e0e0",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-2 py-0.5 font-semibold"
                style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
              >
                {tag}
                <button type="button" onClick={() => toggleTag(tag)} className="ml-0.5 opacity-60 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
            placeholder="Tag personalizada..."
            className="flex-1 h-9 px-3 border border-[#e0e0e0] text-xs focus:outline-none focus:border-[#0f62fe]"
            style={{ color: "#161616" }}
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="h-9 px-4 text-xs font-semibold border border-[#e0e0e0] hover:border-[#161616] transition-colors"
            style={{ color: "#525252" }}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="h-14 px-8 flex items-center gap-3 font-semibold text-sm disabled:opacity-50 transition-colors"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Publicar post <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </form>
  );
}
