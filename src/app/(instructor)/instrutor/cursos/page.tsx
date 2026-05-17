export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  BookOpen, Eye, Pencil, PlusCircle, Users, CheckCircle2, CircleDot, ArrowRight,
} from "lucide-react";

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      category: { select: { name: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-0">

      {/* Header */}
      <div className="bg-white border border-[#e0e0e0] p-6 md:p-8 mb-px flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase mb-2" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}>
            Instrutor
          </p>
          <h1 className="text-2xl font-light" style={{ color: "#161616", letterSpacing: "-0.01em" }}>
            Meus cursos
          </h1>
          <p className="text-sm mt-1" style={{ color: "#525252" }}>
            {courses.length} curso{courses.length !== 1 ? "s" : ""} criado{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/instrutor/cursos/novo"
          className="inline-flex items-center gap-2 px-5 h-10 text-sm font-semibold text-white transition-colors hover:bg-[#0353e9] self-start shrink-0"
          style={{ backgroundColor: "#0f62fe" }}
        >
          <PlusCircle className="h-4 w-4" />
          Novo curso
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-[#e0e0e0] border-t-0 py-16 text-center">
          <div className="h-12 w-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f4f4f4" }}>
            <BookOpen className="h-6 w-6" style={{ color: "#8d8d8d" }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "#161616" }}>Nenhum curso criado ainda</h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#525252", lineHeight: 1.5 }}>
            Crie seu primeiro curso e comece a ensinar na plataforma CFIA.
          </p>
          <Link
            href="/instrutor/cursos/novo"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0353e9]"
            style={{ backgroundColor: "#0f62fe" }}
          >
            <PlusCircle className="h-4 w-4" />
            Criar primeiro curso
          </Link>
        </div>
      ) : (
        <div className="border border-[#e0e0e0] border-t-0 overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div
            className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 text-xs uppercase border-b border-[#e0e0e0]"
            style={{ backgroundColor: "#f4f4f4", color: "#8d8d8d", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
          >
            <div className="col-span-5">Curso</div>
            <div className="col-span-2 text-right">Módulos</div>
            <div className="col-span-2 text-right">Alunos</div>
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
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs" style={{ color: "#8d8d8d" }}>
                    {course.isFree ? "Grátis" : `R$ ${course.price.toFixed(2).replace(".", ",")}`}
                  </span>
                  {course.category && (
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                    >
                      {course.category.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex items-center md:justify-end gap-1.5">
                <BookOpen className="h-3.5 w-3.5 md:hidden" style={{ color: "#8d8d8d" }} />
                <span className="text-sm font-semibold" style={{ color: "#161616" }}>{course._count.modules}</span>
                <span className="text-xs md:hidden" style={{ color: "#8d8d8d" }}>módulos</span>
              </div>

              <div className="md:col-span-2 flex items-center md:justify-end gap-1.5">
                <Users className="h-3.5 w-3.5 md:hidden" style={{ color: "#8d8d8d" }} />
                <span className="text-sm font-semibold" style={{ color: "#161616" }}>{course._count.enrollments}</span>
                <span className="text-xs md:hidden" style={{ color: "#8d8d8d" }}>alunos</span>
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
                  target="_blank"
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

      {/* Link de volta */}
      <div className="mt-4">
        <Link
          href="/instrutor"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Voltar ao painel
        </Link>
      </div>

    </div>
  );
}
