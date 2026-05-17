"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, X, Code2, HelpCircle, Lightbulb, FolderGit2, Image } from "lucide-react";

const TAGS = ["Python", "JavaScript", "IA", "Algoritmos", "ML", "Web", "SQL", "Dúvida", "Projeto"];

const QUICK_ACTIONS = [
  { icon: Code2,      label: "Compartilhar código", tag: "Python" },
  { icon: HelpCircle, label: "Tirar dúvida",         tag: "Dúvida" },
  { icon: Lightbulb,  label: "Compartilhar ideia",   tag: "IA" },
  { icon: FolderGit2, label: "Mostrar projeto",       tag: "Projeto" },
];

function UserAvatar({ name }: { name: string | null | undefined }) {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") ?? "?";
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold select-none"
      style={{ width: 40, height: 40, backgroundColor: "#0f62fe", color: "#ffffff", fontSize: 14 }}
    >
      {initials}
    </div>
  );
}

export function CreatePostBox() {
  const { data: session } = useSession();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0];

  function handleOpen(preTag?: string) {
    if (!session) { router.push("/entrar?callbackUrl=/comunidade"); return; }
    setExpanded(true);
    if (preTag && !tags.includes(preTag)) setTags([preTag]);
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 4)
    );
  }

  function close() {
    setExpanded(false);
    setTitle("");
    setBody("");
    setTags([]);
  }

  async function submit() {
    if (!title.trim()) { toast.error("Escreva um título para o post"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() || null, tags }),
      });
      if (!res.ok) { toast.error("Erro ao publicar"); return; }
      const post = await res.json();
      toast.success("Post publicado com sucesso!");
      router.push(`/comunidade/${post.id}`);
    } catch {
      toast.error("Erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Estado colapsado ── */
  if (!expanded) {
    return (
      <div className="bg-white border border-[#e0e0e0]" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        {/* Trigger principal */}
        <div className="flex items-center gap-3 px-4 py-3">
          <UserAvatar name={session?.user?.name} />
          <button
            onClick={() => handleOpen()}
            className="flex-1 h-10 rounded-full border text-left px-4 text-sm transition-colors hover:bg-[#f4f4f4] focus:outline-none"
            style={{ color: "#8d8d8d", borderColor: "#d0d0d0", backgroundColor: "#f4f4f4" }}
          >
            {session
              ? `No que você está pensando, ${firstName}?`
              : "Entre para compartilhar algo com a comunidade..."}
          </button>
        </div>

        {/* Ações rápidas */}
        <div className="flex items-center border-t" style={{ borderColor: "#e0e0e0" }}>
          {QUICK_ACTIONS.map(({ icon: Icon, label, tag }) => (
            <button
              key={label}
              onClick={() => handleOpen(tag)}
              className="flex flex-1 items-center justify-center gap-1.5 h-10 text-xs font-semibold transition-colors hover:bg-[#f4f4f4]"
              style={{ color: "#525252" }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#0f62fe" }} />
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Estado expandido ── */
  return (
    <div className="bg-white border border-[#0f62fe]" style={{ boxShadow: "0 0 0 1px #0f62fe20" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <UserAvatar name={session?.user?.name} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#161616" }}>
              {session?.user?.name ?? "Você"}
            </p>
            <p className="text-[11px]" style={{ color: "#8d8d8d" }}>
              Publicando na comunidade
            </p>
          </div>
        </div>
        <button
          onClick={close}
          className="p-1.5 transition-colors hover:bg-[#f4f4f4]"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" style={{ color: "#8d8d8d" }} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Título */}
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da sua publicação..."
            autoFocus
            maxLength={200}
            className="w-full text-base font-bold pb-2 border-b focus:outline-none focus:border-[#0f62fe] transition-colors bg-transparent"
            style={{ color: "#161616", borderColor: title ? "#0f62fe" : "#e0e0e0" }}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] font-mono" style={{ color: title.length > 180 ? "#da1e28" : "#8d8d8d" }}>
              {title.length}/200
            </span>
          </div>
        </div>

        {/* Corpo */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Adicione detalhes, código, links ou contexto... (opcional)"
          rows={4}
          className="w-full text-sm leading-relaxed resize-none focus:outline-none bg-transparent"
          style={{ color: "#525252" }}
        />

        {/* Tags */}
        <div>
          <p
            className="text-[10px] uppercase font-bold mb-2 tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}
          >
            Tópicos (máx. 4)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="text-xs px-3 py-1 border transition-all font-semibold"
                style={{
                  backgroundColor: tags.includes(tag) ? "#0f62fe" : "transparent",
                  color: tags.includes(tag) ? "#ffffff" : "#525252",
                  borderColor: tags.includes(tag) ? "#0f62fe" : "#e0e0e0",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "#f4f4f4" }}>
          <button
            className="flex items-center gap-1.5 text-xs px-2 py-1.5 transition-colors hover:text-[#0f62fe]"
            style={{ color: "#8d8d8d" }}
            type="button"
            title="Em breve"
          >
            <Image className="h-3.5 w-3.5" /> Imagem
          </button>

          <div className="flex gap-2">
            <button
              onClick={close}
              className="h-9 px-4 text-sm font-semibold border transition-colors hover:bg-[#f4f4f4]"
              style={{ borderColor: "#e0e0e0", color: "#525252" }}
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={loading || !title.trim()}
              className="h-9 px-5 flex items-center gap-2 text-sm font-bold disabled:opacity-50 transition-colors hover:bg-[#0353e9]"
              style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <>Publicar <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
