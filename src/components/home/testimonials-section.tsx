"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
      <div className="mx-auto max-w-6xl text-center">
        <span
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4"
        >
          Depoimentos
        </span>
        <h2
          className="text-3xl font-light mb-4"
          style={{ color: "#161616", letterSpacing: "-0.02em" }}
        >
          Ainda não temos depoimentos.
        </h2>
        <p className="text-sm text-[#525252] max-w-md mx-auto mb-8 leading-relaxed">
          O CFIA é novo. Quando os primeiros alunos concluírem seus cursos, os depoimentos
          reais aparecerão aqui. Sem depoimentos inventados.
        </p>
        <Link
          href="/cursos"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "#0f62fe", textDecoration: "none" }}
        >
          Seja um dos primeiros alunos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
