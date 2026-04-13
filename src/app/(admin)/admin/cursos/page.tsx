export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

async function getCourses() {
  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true, email: true } },
      category: { select: { name: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
  });
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export default async function AdminCursosPage() {
  const courses = await getCourses();
  const total = courses.length;
  const published = courses.filter((c) => c.isPublished).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total} cursos no total — {published} publicados
          </p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">Nenhum curso criado ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f7f8fa" }}>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Curso</th>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Instrutor</th>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Categoria</th>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Matrículas</th>
                <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Módulos</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <Link
                          href={`/cursos/${course.slug}`}
                          className="font-medium hover:text-[#0052ff] transition-colors"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {LEVEL_LABELS[course.level] ?? course.level}
                          {course.isFree ? " · Grátis" : ` · R$${course.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {course.instructor.name ?? course.instructor.email}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {course.category?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    {course.isPublished ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ backgroundColor: "#05966915", color: "#059669" }}>
                        <Eye className="h-3 w-3" />
                        Publicado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit bg-gray-100 text-gray-500">
                        <EyeOff className="h-3 w-3" />
                        Rascunho
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{course._count.enrollments}</td>
                  <td className="px-6 py-4 text-muted-foreground">{course._count.modules}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
