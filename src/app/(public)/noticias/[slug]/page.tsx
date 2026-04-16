import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, ChevronLeft, Share2, BookOpen, ChevronRight, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/course-card";

export const dynamic = "force-dynamic";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

async function getNewsData(slug: string) {
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          bio: true,
        },
      },
    },
  });

  if (!news || !news.published) return null;

  // Fetch recommended courses
  const recommendedCourses = await prisma.course.findMany({
    where: { isPublished: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  });

  return { news, recommendedCourses };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const data = await getNewsData(slug);

  if (!data) notFound();

  const { news, recommendedCourses } = data;

  // Calculate reading time
  const wordCount = news.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-white min-h-screen">
      {/* ── Breadcrumb & Navigation ── */}
      <nav className="bg-[#f4f4f4] border-b border-[#c6c6c6] py-3 px-6">
        <div className="mx-auto max-w-[1584px] flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Link href="/home" className="text-[#0f62fe] hover:underline">Home</Link>
              <ChevronRight className="h-3 w-3 text-[#8d8d8d]" />
              <Link href="/noticias" className="text-[#0f62fe] hover:underline">Editorial</Link>
              <ChevronRight className="h-3 w-3 text-[#8d8d8d]" />
              <span className="text-[#161616] truncate max-w-[200px]">{news.title}</span>
           </div>
           <Link href="/noticias" className="text-[10px] font-mono uppercase tracking-widest text-[#0f62fe] hover:underline flex items-center gap-1">
              <ChevronLeft className="h-3 w-3" /> Voltar
           </Link>
        </div>
      </nav>

      <article className="pt-20 pb-32">
        <div className="mx-auto max-w-4xl px-6">
          <header className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 uppercase font-mono text-[10px] tracking-[0.2em] text-[#0f62fe]">
                 <span className="h-[1px] w-6 bg-[#0f62fe]" />
                 {news.category || "Relatório Técnico"}
              </div>
              <div className="text-[10px] font-mono text-[#8d8d8d] uppercase tracking-widest flex items-center gap-2">
                 <Terminal className="h-3 w-3" /> STABLE_VERSION
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-light mb-12 leading-[1.1] text-[#161616]" style={{ letterSpacing: "-0.01em" }}>
              {news.title}
            </h1>

            {news.imageUrl && (
              <div className="mb-12 border border-[#c6c6c6] bg-[#f4f4f4] aspect-[21/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#c6c6c6] border-y border-[#c6c6c6] py-10">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase">Autor</span>
                  <span className="text-sm font-bold text-[#161616]">{news.author.name}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase">Publicado</span>
                  <span className="text-sm text-[#161616]">
                    {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(news.createdAt)}
                  </span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8d8d8d] uppercase">Duração</span>
                  <span className="text-sm text-[#161616] flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {readingTime} min de leitura
                  </span>
               </div>
            </div>
          </header>

          {/* Body Content - Custom Typographic System */}
          <div className="max-w-none">
             <div className="space-y-10 text-[#161616] leading-[1.7] text-xl font-normal">
                {news.content.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i} className="first-letter:text-3xl first-letter:font-light first-letter:float-left first-letter:mr-1 first-letter:mt-1 border-l-0 pl-0">
                    {paragraph}
                  </p>
                ))}
             </div>
          </div>


          {/* Social / Action */}
          <footer className="mt-24 pt-10 border-t border-[#c6c6c6] flex items-center justify-between">
             <button className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#0f62fe] hover:underline">
               <Share2 className="h-4 w-4" /> Compartilhar Relatório
             </button>
             <div className="text-[10px] font-mono text-[#8d8d8d]">
               CFIA_PRESS_RELEASE.DOCX
             </div>
          </footer>
        </div>
      </article>

      {/* ── Recommendations Grid ── */}
      <section className="bg-[#f4f4f4] py-24 border-t border-[#c6c6c6]">
        <div className="mx-auto max-w-[1584px] px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">Related Knowledge</span>
              <h2 className="text-4xl font-light text-[#161616]">Acelere sua formao.</h2>
            </div>
            <Link href="/cursos" className="hidden sm:flex items-center gap-4 text-sm font-semibold p-5 bg-[#161616] text-white hover:bg-[#393939] transition-all">
              Ver Catlogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#c6c6c6] border border-[#c6c6c6]">
            {recommendedCourses.map(course => (
              <div key={course.id} className="bg-white">
                <CourseCard course={course as any} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
