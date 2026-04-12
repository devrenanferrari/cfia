import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Clock, ArrowRight } from "lucide-react";

async function getDashboardData(userId: string) {
  const [enrollments, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: { select: { id: true } } },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 5,
    }),
    prisma.certificate.count({ where: { userId } }),
  ]);

  const progressData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0
      );
      const completedLessons = await prisma.progress.count({
        where: {
          userId,
          completed: true,
          lesson: { module: { courseId: enrollment.courseId } },
        },
      });
      return {
        enrollment,
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    })
  );

  return { progressData, certificates, totalEnrollments: enrollments.length };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { progressData, certificates, totalEnrollments } = await getDashboardData(session.user.id);

  const firstName = session.user.name?.split(" ")[0] ?? "aluno";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Olá, {firstName}!</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de aprendizagem.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cursos matriculados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressData.filter((p) => p.percentage > 0 && p.percentage < 100).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cursos recentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Continuar aprendendo</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/cursos">
              Ver todos
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        {progressData.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="mb-4">Você ainda não está matriculado em nenhum curso.</p>
              <Button asChild>
                <Link href="/cursos">Explorar cursos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {progressData.map(({ enrollment, totalLessons, completedLessons, percentage }) => (
              <Card key={enrollment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{enrollment.course.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span>{completedLessons}/{totalLessons} aulas</span>
                        <Badge variant={percentage === 100 ? "default" : "secondary"} className="text-xs">
                          {percentage === 100 ? "Concluído" : `${percentage}%`}
                        </Badge>
                      </div>
                      <Progress value={percentage} className="mt-3 h-1.5" />
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/cursos/${enrollment.course.slug}`}>
                        {percentage === 0 ? "Começar" : "Continuar"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
