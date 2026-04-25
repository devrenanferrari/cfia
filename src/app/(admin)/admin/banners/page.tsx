"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaUrl: string;
  imageUrl: string | null;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  position: number;
  createdAt: string;
}

const EMPTY: Omit<Banner, "id" | "createdAt"> = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaUrl: "/cursos",
  imageUrl: "",
  bgColor: "#edf5ff",
  textColor: "#161616",
  isActive: true,
  position: 0,
};

const BG_PRESETS = [
  { label: "Azul claro", value: "#edf5ff" },
  { label: "Azul carbono", value: "#0f62fe" },
  { label: "Escuro", value: "#161616" },
  { label: "Verde", value: "#defbe6" },
  { label: "Roxo", value: "#f6f2ff" },
  { label: "Dourado", value: "#fdf6e4" },
];

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data);
    } catch {
      toast.error("Erro ao carregar banners.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowForm(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      ctaText: b.ctaText ?? "",
      ctaUrl: b.ctaUrl,
      imageUrl: b.imageUrl ?? "",
      bgColor: b.bgColor,
      textColor: b.textColor,
      isActive: b.isActive,
      position: b.position,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Título é obrigatório."); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Banner atualizado." : "Banner criado.");
      setShowForm(false);
      load();
    } catch {
      toast.error("Erro ao salvar banner.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(b: Banner) {
    try {
      await fetch(`/api/admin/banners/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      setBanners((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, isActive: !x.isActive } : x))
      );
    } catch {
      toast.error("Erro ao atualizar banner.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner excluído.");
    } catch {
      toast.error("Erro ao excluir.");
    }
  }

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#525252" }}>
        {label}
      </label>
      <input
        type={type}
        value={String(form[key] ?? "")}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className="w-full h-10 px-3 text-sm"
        style={{ color: "#161616" }}
      />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#161616", letterSpacing: 0 }}>
            Banners promocionais
          </h1>
          <p className="text-sm mt-1" style={{ color: "#525252" }}>
            Configure os banners exibidos na página inicial.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 h-10 text-sm font-semibold"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff", border: "none", cursor: "pointer" }}
        >
          <Plus className="h-4 w-4" /> Novo banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="mb-8 p-6"
          style={{ border: "1px solid #e0e0e0", backgroundColor: "#f4f4f4" }}
        >
          <h2 className="text-base font-semibold mb-6" style={{ color: "#161616" }}>
            {editing ? "Editar banner" : "Novo banner"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {field("Título *", "title")}
            {field("Subtítulo", "subtitle")}
            {field("Texto do botão (CTA)", "ctaText")}
            {field("URL do CTA", "ctaUrl")}
            {field("URL da imagem", "imageUrl")}
          </div>

          {/* Color presets */}
          <div className="space-y-1.5 mb-4">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#525252" }}>
              Cor de fundo
            </label>
            <div className="flex flex-wrap gap-2">
              {BG_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm((f) => ({
                    ...f,
                    bgColor: p.value,
                    textColor: ["#0f62fe","#161616"].includes(p.value) ? "#ffffff" : "#161616",
                  }))}
                  className="flex items-center gap-2 px-3 h-8 text-xs font-medium border transition-colors"
                  style={{
                    backgroundColor: p.value,
                    color: ["#0f62fe","#161616"].includes(p.value) ? "#ffffff" : "#161616",
                    borderColor: form.bgColor === p.value ? "#0f62fe" : "#c6c6c6",
                    borderWidth: form.bgColor === p.value ? 2 : 1,
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => setForm((f) => ({ ...f, bgColor: e.target.value }))}
                  className="h-8 w-10 cursor-pointer"
                  style={{ padding: 2 }}
                />
                <span className="text-xs" style={{ color: "#525252" }}>Personalizar</span>
              </div>
            </div>
          </div>

          {/* Text color */}
          <div className="space-y-1.5 mb-6">
            <label className="block text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#525252" }}>
              Cor do texto
            </label>
            <div className="flex gap-2">
              {["#161616", "#ffffff"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, textColor: c }))}
                  className="h-8 px-4 text-xs font-semibold border"
                  style={{
                    backgroundColor: c,
                    color: c === "#161616" ? "#ffffff" : "#161616",
                    borderColor: form.textColor === c ? "#0f62fe" : "#c6c6c6",
                    borderWidth: form.textColor === c ? 2 : 1,
                    cursor: "pointer",
                  }}
                >
                  {c === "#161616" ? "Escuro" : "Claro"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "#525252" }}>
              Pré-visualização
            </p>
            <div
              className="p-6 relative overflow-hidden"
              style={{ backgroundColor: form.bgColor, color: form.textColor, minHeight: 100 }}
            >
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt=""
                  className="absolute right-0 top-0 h-full object-cover opacity-20 pointer-events-none"
                  style={{ maxWidth: "50%" }}
                />
              )}
              <div className="relative z-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-2 opacity-60">Destaque</p>
                <p className="text-xl font-bold mb-1">{form.title || "Título do banner"}</p>
                {form.subtitle && <p className="text-sm opacity-75 mb-3">{form.subtitle}</p>}
                {form.ctaText && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2"
                    style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}>
                    {form.ctaText} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 h-10 text-sm font-semibold"
              style={{ backgroundColor: "#0f62fe", color: "#ffffff", border: "none", cursor: "pointer" }}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Salvando…" : "Salvar banner"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 h-10 text-sm font-medium border"
              style={{ backgroundColor: "#ffffff", color: "#161616", borderColor: "#c6c6c6", cursor: "pointer" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Banner list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#0f62fe" }} />
        </div>
      ) : banners.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          style={{ border: "1px solid #e0e0e0", backgroundColor: "#f4f4f4" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#161616" }}>Nenhum banner criado</p>
          <p className="text-sm" style={{ color: "#525252" }}>
            Crie o primeiro banner para a página inicial.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 p-4"
              style={{ border: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}
            >
              {/* Color swatch */}
              <div
                className="w-12 h-12 flex-shrink-0"
                style={{ backgroundColor: b.bgColor, border: "1px solid rgba(0,0,0,0.08)" }}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#161616" }}>
                  {b.title}
                </p>
                {b.subtitle && (
                  <p className="text-xs truncate mt-0.5" style={{ color: "#525252" }}>
                    {b.subtitle}
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: "#8d8d8d", fontFamily: "var(--font-mono)" }}>
                  CTA: {b.ctaText || "—"} → {b.ctaUrl}
                </p>
              </div>

              {b.imageUrl && (
                <img
                  src={b.imageUrl}
                  alt=""
                  className="h-12 w-20 object-cover flex-shrink-0"
                  style={{ border: "1px solid #e0e0e0" }}
                />
              )}

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(b)}
                  title={b.isActive ? "Desativar" : "Ativar"}
                  className="h-9 w-9 flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: b.isActive ? "#edf5ff" : "#f4f4f4",
                    borderColor: b.isActive ? "#0f62fe" : "#c6c6c6",
                    color: b.isActive ? "#0f62fe" : "#8d8d8d",
                    cursor: "pointer",
                  }}
                >
                  {b.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="h-9 px-3 text-xs font-semibold border"
                  style={{ backgroundColor: "#ffffff", color: "#161616", borderColor: "#c6c6c6", cursor: "pointer" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="h-9 w-9 flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50"
                  style={{ cursor: "pointer" }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
