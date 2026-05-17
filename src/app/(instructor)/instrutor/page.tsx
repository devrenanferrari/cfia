export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  BookOpen, Users, Star, PlusCircle, Eye, Pencil,
  TrendingUp, ArrowRight, CircleDot, CheckCircle2,
} from "lucide-react";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: { _count: { select: { enrollments: true, reviews: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);
  const totalReviews = courses.reduce((acc, c) => acc + c._count.reviews, 0);
  const published = courses.filter((c) => c.isPublished).length;
  const drafts = courses.length - published;
  const firstName = session.user.name?.split(" ")[0] ?? "Instrutor";

  return (
    <div className="space-y-0">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e0e0e0] p-6 md:p-8 mb-px flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}>
            Área do instrutor
          </p>
          <h1 className="text-3xl font-light" style={{ color: "#161616", letterSpacing: "-0.01em" }}>
            Olá, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#525252" }}>
            Gerencie seus cursos e acompanhe o desempenho dos alunos.
          </p>
        </div>
        <Link
          href="/instrutor/cursos/novo"
          className="inline-flex items-center gap-2 px-5 h-10 text-sm font-semibold text-white transition-colors hover:bg-[#0353e9] self-start shrink-0"
          style={{ backgroundColor: "#0f62fe" }}
        >
          <PlusCircle className="h-4 w-4" />
          Criar curso
        </Link>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0] border-t-0">
        {[
          { label: "Total de cursos", value: courses.length, icon: BookOpen },
          { label: "Alunos matriculados", value: totalStudents, icon: Users },
          { label: "Avaliações recebidas", value: totalReviews, icon: Star },
          { label: "Cursos publicados", value: published, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-5 md:p-6 flex flex-col gap-4">
            <Icon className="h-5 w-5" style={{ color: "#8d8d8d" }} />
            <div>
              <div className="text-4xl font-light mb-1" style={{ fontFamily: "var(--font-serif), Georgia, serif", color: "#161616", letterSpacing: "-0.02em" }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: "#525252" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alerta rascunhos ───────────────────────────────────── */}
      {drafts > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 mt-px border border-[#e0e0e0] border-t-0" style={{ backgroundColor: "#fff8e1" }}>
          <p className="text-sm" style={{ color: "#3c2200" }}>
            Você tem <strong>{drafts}</strong> curso{drafts > 1 ? "s" : ""} em rascunho ainda não publicado{drafts > 1 ? "s" : ""}.
          </p>
          <Link href="/instrutor/cursos" className="text-xs font-semibold whitespace-nowrap flex items-center gap-1 hover:underline" style={{ color: "#3c2200" }}>
            Ver rascunhos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* ── Cursos ─────────────────────────────────────────────── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base" style={{ color: "#161616" }}>Seus cursos</h2>
          {courses.length > 0 && (
            <Link href="/instrutor/cursos" className="text-sm flex items-center gap-1 transition-colors hover:text-[#0043ce]" style={{ color: "#0f62fe" }}>
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="bg-white border border-[#e0e0e0] py-16 text-center">
            <div className="h-12 w-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f4f4f4" }}>
              <BookOpen className="h-6 w-6" style={{ color: "#8d8d8d" }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "#161616" }}>Nenhum curso criado ainda</h3>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#525252", lineHeight: 1.5 }}>
              Crie seu primeiro curso e comece a ensinar na plataforma CFIA.
            </p>
            <Link href="/instrutor/cursos/novo" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0353e9]" style={{ backgroundColor: "#0f62fe" }}>
              <PlusCircle className="h-4 w-4" />
              Criar primeiro curso
            </Link>
          </div>
        ) : (
          <div className="border border-[#e0e0e0] overflow-hidden">
            {/* Cabeçalho */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 text-xs uppercase border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4", color: "#8d8d8d", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
              <div className="col-span-5">Curso</div>
              <div className="col-span-2 text-right">Alunos</div>
              <div className="col-span-2 text-right">Avaliações</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            {courses.map((course, i) => (
              <div
                key={course.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 bg-white transition-colors hover:bg-[#f4f4f4]"
                style={{ borderBottom: i < courses.length - 1 ? "1px solid #e0e0e0" : undefined }}
              >
                <div className="md:col-span-5 min-w-0">
                  <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "#161616" }}>
                    {course.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>
                    {course.isFree ? "Grátis" : `R$ ${course.price.toFixed(2).replace(".", ",")}`}
                  </p>
                </div>

                <div className="md:col-span-2 flex items-center md:justify-end gap-1.5">
                  <Users className="h-3.5 w-3.5 md:hidden" style={{ color: "#8d8d8d" }} />
                  <span className="text-sm font-semibold" style={{ color: "#161616" }}>{course._count.enrollments}</span>
                  <span className="text-xs md:hidden" style={{ color: "#8d8d8d" }}>alunos</span>
                </div>

                <div className="md:col-span-2 flex items-center md:justify-end gap-1.5">
                  <Star className="h-3.5 w-3.5 md:hidden" style={{ color: "#8d8d8d" }} />
                  <span className="text-sm font-semibold" style={{ color: "#161616" }}>{course._count.reviews}</span>
                  <span className="text-xs md:hidden" style={{ color: "#8d8d8d" }}>avaliações</span>
                </div>

                <div className="md:col-span-1 flex items-center md:justify-center">
                  {course.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5" style={{ backgroundColor: "#defbe6", color: "#24a148" }}>
                      <CheckCircle2 className="h-3 w-3" /> Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5" style={{ backgroundColor: "#f4f4f4", color: "#8d8d8d" }}>
                      <CircleDot className="h-3 w-3" /> Rascunho
                    </span>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center md:justify-end gap-2">
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border transition-colors hover:border-[#0f62fe] hover:text-[#0f62fe]"
                    style={{ borderColor: "#e0e0e0", color: "#525252" }}
                  >
                    <Eye className="h-3.5 w-3.5" /> Ver
                  </Link>
                  <Link
                    href={`/instrutor/cursos/${course.id}`}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white transition-colors hover:bg-[#0353e9]"
                    style={{ backgroundColor: "#0f62fe" }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Atalhos ─────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
        {[
          { href: "/instrutor/cursos/novo", label: "Criar novo curso", desc: "Adicione aulas, quizzes e materiais didáticos.", icon: PlusCircle },
          { href: "/instrutor/cursos", label: "Gerenciar conteúdo", desc: "Edite módulos, aulas e configure quizzes.", icon: BookOpen },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-start gap-4 bg-white p-5 hover:bg-[#f4f4f4] transition-colors group">
            <div className="h-10 w-10 flex items-center justify-center shrink-0" style={{ backgroundColor: "#edf5ff" }}>
              <Icon className="h-5 w-5" style={{ color: "#0f62fe" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>
                {label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#0f62fe" }} />
          </Link>
        ))}
      </div>

    </div>
  );
}
