"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

type News = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  createdAt: Date;
};

export function EditorialSection({ newsList }: { newsList: News[] }) {
  if (newsList.length === 0) return null;

  const [featured, ...others] = newsList;

  return (
    <section className="py-28 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "#06b6d410", color: "#06b6d4" }}
            >
              Editorial
            </span>
            <h2 className="text-4xl font-black mb-4" style={{ color: "#06070a", letterSpacing: "-0.03em" }}>
              O pulso da Inteligência Artificial
            </h2>
            <p className="text-muted-foreground">
              Análises técnicas, comunicados institucionais e o que há de mais relevante no cenário de tecnologia global.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Link href={`/noticias/${featured.slug}`} className="group block">
              <div 
                className="aspect-[16/9] bg-gray-100 rounded-3xl overflow-hidden mb-8 relative"
                style={{ backgroundColor: "var(--cds-layer-01)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <div className="flex items-center gap-2 text-white font-bold">
                     Continuar lendo <ArrowRight className="h-5 w-5" />
                   </div>
                </div>
                <div className="h-full w-full flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-gray-400" />
                <time className="text-xs font-mono uppercase tracking-widest text-gray-500">
                  {new Intl.DateTimeFormat('pt-BR').format(featured.createdAt)}
                </time>
              </div>
              <h3 className="text-3xl font-black mb-4 transition-colors group-hover:text-[var(--cds-interactive)]" style={{ color: "var(--cds-text-primary)" }}>
                {featured.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed line-clamp-2">
                {featured.summary}
              </p>
            </Link>
          </motion.div>

          {/* Side List */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {others.map((news, i) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group"
              >
                <Link href={`/noticias/${news.slug}`} className="flex gap-6">
                  <div className="h-24 w-24 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-[var(--cds-interactive)] transition-colors">
                    <BookOpen className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-mono tracking-widest text-gray-400">
                         {new Intl.DateTimeFormat('pt-BR').format(news.createdAt)}
                       </span>
                    </div>
                    <h4 className="font-bold text-lg leading-snug group-hover:text-[var(--cds-interactive)] transition-colors">
                      {news.title}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <Link 
              href="/noticias" 
              className="mt-4 flex items-center justify-center w-full py-4 border rounded-2xl text-sm font-bold transition-all hover:bg-gray-50"
              style={{ borderColor: "var(--cds-border-strong)", color: "var(--cds-text-primary)" }}
            >
              Ver todas as atualizações
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
