"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Image as ImageIcon, Tag } from "lucide-react";
import { createNews } from "@/app/actions/news";

export function NewsForm() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    category: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex border-b border-[var(--cds-border-subtle)]">
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "edit" 
              ? "border-[var(--cds-interactive)] text-[var(--cds-text-primary)]" 
              : "border-transparent text-[var(--cds-text-secondary)] hover:bg-[var(--cds-layer-01)]"
          }`}
        >
          <Edit3 className="h-4 w-4" /> Escrever
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "preview" 
              ? "border-[var(--cds-interactive)] text-[var(--cds-text-primary)]" 
              : "border-transparent text-[var(--cds-text-secondary)] hover:bg-[var(--cds-layer-01)]"
          }`}
        >
          <Eye className="h-4 w-4" /> Prévia
        </button>
      </div>

      <form action={createNews} className={`space-y-8 bg-white border border-[var(--cds-border-subtle)] p-8 ${activeTab === "preview" ? "hidden" : "block"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-xs font-semibold uppercase tracking-widest text-[#6f6f6f]">Título do Relatório</label>
              <input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 px-4 bg-[#f4f4f4] border-b border-[#8d8d8d] focus:border-b-2 focus:border-[#0f62fe] outline-none"
                placeholder="Ex: CFIA lança novo curso de Redes Neurais"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-xs font-semibold uppercase tracking-widest text-[#6f6f6f]">Subtítulo / Resumo</label>
              <input
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full h-12 px-4 bg-[#f4f4f4] border-b border-[#8d8d8d] focus:border-b-2 focus:border-[#0f62fe] outline-none"
                placeholder="Breve descrição para o feed"
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-xs font-semibold uppercase tracking-widest text-[#6f6f6f] flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> URL da Imagem de Capa
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full h-12 px-4 bg-[#f4f4f4] border-b border-[#8d8d8d] focus:border-b-2 focus:border-[#0f62fe] outline-none"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-xs font-semibold uppercase tracking-widest text-[#6f6f6f] flex items-center gap-2">
                <Tag className="h-3 w-3" /> Categoria
              </label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-12 px-4 bg-[#f4f4f4] border-b border-[#8d8d8d] focus:border-b-2 focus:border-[#0f62fe] outline-none"
                placeholder="Ex: Técnico, Atualização, Evento"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-xs font-semibold uppercase tracking-widest text-[#6f6f6f]">Conteúdo (Suporta parágrafos)</label>
          <textarea
            id="content"
            name="content"
            required
            rows={15}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-4 bg-[#f4f4f4] border-b border-[#8d8d8d] focus:border-b-2 focus:border-[#0f62fe] outline-none font-mono text-sm leading-relaxed"
            placeholder="Escreva aqui..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input id="published" name="published" type="checkbox" defaultChecked className="h-4 w-4 rounded-none accent-[#0f62fe]" />
          <label htmlFor="published" className="text-sm font-medium">Publicar imediatamente</label>
        </div>

        <div className="pt-8 border-t border-[var(--cds-border-subtle)] flex justify-end gap-4">
          <Button
            type="button"
            className="rounded-none font-semibold px-6 border border-[#161616] bg-transparent text-[#161616] hover:bg-[#f4f4f4]"
            asChild
          >
            <Link href="/admin/noticias">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            className="rounded-none font-semibold px-8 bg-[#0f62fe] text-white hover:bg-[#0353e9]"
          >
            Salvar Notícia
          </Button>
        </div>
      </form>

      {activeTab === "preview" && (
        <div className="bg-white border border-[var(--cds-border-subtle)] p-12 min-h-[600px] overflow-auto">
          <div className="max-w-3xl mx-auto">
            {formData.category && (
              <span className="text-[10px] font-mono text-[#0f62fe] uppercase tracking-[0.2em] block mb-4 border-l-2 border-[#0f62fe] pl-2">
                {formData.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-light mb-8 leading-[1.1] text-[#161616]">
              {formData.title || "Sem título"}
            </h1>
            
            {formData.imageUrl && (
              <div className="aspect-video w-full bg-[#f4f4f4] mb-12 border border-[#c6c6c6] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.imageUrl} alt="Capa" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-6 text-[#161616] leading-relaxed text-lg font-normal">
              {(formData.content || "Nenhum conteúdo escrito.").split(/\n\s*\n/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
