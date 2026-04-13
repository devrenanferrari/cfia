export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";

async function getEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          category: { select: { name: true } },
          modules: { include: { lessons: { select: { id: true } } } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return Promise.all(
    enrollments.map(async (e) => {
      const totalLessons = e.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = await prisma.progress.count({
        where: { userId, completed: true, lesson: { module: { courseId: e.courseId } } },
      });
      return {
        ...e,
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    })
  );
}

export default async function MeusCursosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const enrollments = await getEnrollments(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus cursos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {enrollments.length} curso{enrollments.length !== 1 ? "s" : ""} matriculado{enrollments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-white">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-semibold mb-2">Você ainda não tem cursos</h2>
          <p className="text-muted-foreground text-sm mb-6">Explore o catálogo e comece a aprender.</p>
          <Button style={{ backgroundColor: "#0052ff" }} className="rounded-[56px] px-8" asChild>
            <Link href="/cursos">Explorar cursos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => (
            <div key={e.id} className="bg-white border rounded-2xl p-6 flex items-center gap-6">
              {/* Thumbnail placeholder */}
              <div
                className="h-16 w-24 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "#0052ff10" }}
              >
                {e.course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.course.thumbnail} alt={e.course.title} className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <BookOpen className="h-6 w-6" style={{ color: "#0052ff55" }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold line-clamp-1">{e.course.title}</h3>
                  {e.percentage === 100 && (
                    <Badge className="text-xs" style={{ backgroundColor: "#05966920", color: "#059669", border: "none" }}>
                      Concluído
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {e.course.instructor.name} {e.course.category ? `· ${e.course.category.name}` : ""}
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={e.percentage} className="flex-1 h-1.5" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {e.completedLessons}/{e.totalLessons} aulas ({e.percentage}%)
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="rounded-[56px] px-5 shrink-0"
                style={{ backgroundColor: "#0052ff" }}
                asChild
              >
                <Link href={`/dashboard/cursos/${e.course.slug}`}>
                  {e.percentage === 0 ? "Começar" : e.percentage === 100 ? "Rever" : "Continuar"}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
