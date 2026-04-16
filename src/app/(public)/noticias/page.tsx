import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsListPage() {
  const newsList = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-16 px-6 bg-[#161616] text-white border-b border-[#393939]">
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
               <span className="h-1 w-6 bg-[#0f62fe]" />
               <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8d8d8d]">Press & Media Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-8" style={{ letterSpacing: "-0.01em" }}>
              Editorial CFIA
            </h1>
            <p className="text-xl text-[#c6c6c6] leading-relaxed font-normal max-w-2xl">
              Análises técnicas, comunicados institucionais e o progresso da nossa engenharia de Inteligência Artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#c6c6c6] py-3 px-6">
        <div className="mx-auto max-w-[1584px] flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
           <Link href="/home" className="text-[#0f62fe] hover:underline">Home</Link>
           <ChevronRight className="h-3 w-3 text-[#8d8d8d]" />
           <span className="text-[#161616]">Editorial</span>
        </div>
      </div>

      {/* Main List */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-[1584px]">
          {newsList.length === 0 ? (
            <div className="py-32 text-center bg-white border border-[#c6c6c6]">
              <BookOpen className="h-8 w-8 text-[#c6c6c6] mx-auto mb-4" />
              <p className="text-xs font-mono text-[#8d8d8d] uppercase tracking-widest">Nenhuma publicação encontrada</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[1px] bg-[#c6c6c6] border border-[#c6c6c6]">
              {newsList.map((news) => (
                <Link 
                  key={news.id} 
                  href={`/noticias/${news.slug}`}
                  className="group bg-white p-10 flex flex-col md:flex-row md:items-center justify-between gap-12 hover:bg-[#f4f4f4] transition-colors"
                >
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#8d8d8d]" />
                        <time className="text-xs font-mono uppercase tracking-widest text-[#525252]">
                           {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(news.createdAt)}
                        </time>
                      </div>
                      {news.category && (
                        <>
                          <span className="text-[#c6c6c6]">|</span>
                          <span className="text-[10px] font-mono text-[#0f62fe] uppercase tracking-widest">
                            {news.category}
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="text-3xl font-semibold mb-4 group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>
                      {news.title}
                    </h2>
                    <p className="text-[#525252] text-base line-clamp-2 leading-relaxed max-w-2xl">
                      {news.summary}
                    </p>
                  </div>
                  <div className="h-16 w-16 flex items-center justify-center border border-[#c6c6c6] text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-all shrink-0">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
