"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alexandre Silva",
    role: "Senior Data Scientist @ iFood",
    content: "O conteúdo do CFIA é o mais denso que já vi no Brasil. Não é apenas tutorial de biblioteca, é engenharia de verdade aplicada a modelos de larga escala.",
    avatar: "AS",
  },
  {
    name: "Beatriz Santos",
    role: "ML Engineer @ Nubank",
    content: "Migrar para IA parecia impossível até eu encontrar a trilha de MLOps aqui. Hoje gerencio pipelines que processam milhões de requisições.",
    avatar: "BS",
  },
  {
    name: "Ricardo Mendes",
    role: "Tech Lead @ Porto Seguro",
    content: "Treinei todo meu time de Analytics usando a CFIA. A curva de aprendizado foi reduzida pela metade devido à qualidade dos projetos práticos.",
    avatar: "RM",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-28 px-4 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "#7c3aed10", color: "#7c3aed" }}
          >
            Depoimentos
          </span>
          <h2 className="text-4xl font-black mb-4" style={{ color: "#06070a", letterSpacing: "-0.03em" }}>
            Histórias de quem está no campo de batalha
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nossos alunos não apenas assistem aulas, eles constroem o futuro da tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
            >
              <Quote className="absolute top-6 right-8 h-10 w-10 text-gray-50" />
              <div className="relative z-10">
                <p className="text-gray-600 mb-8 leading-relaxed italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: "linear-gradient(135deg, #0052ff, #7c3aed)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
