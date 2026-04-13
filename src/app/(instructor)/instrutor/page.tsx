export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star, PlusCircle, Eye, Pencil } from "lucide-react";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id },
    include: {
      _count: { select: { enrollments: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);
  const totalReviews = courses.reduce((acc, c) => acc + c._count.reviews, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel do instrutor</h1>
          <p className="text-muted-foreground">Gerencie seus cursos e acompanhe o progresso dos alunos.</p>
        </div>
        <Button
          className="rounded-[56px] px-5 font-semibold"
          style={{ backgroundColor: "#0052ff" }}
          asChild
        >
          <Link href="/instrutor/cursos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar curso
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alunos matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avaliações recebidas</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de cursos */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Seus cursos</h2>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="mb-4">Você ainda não criou nenhum curso.</p>
              <Button
                className="rounded-[56px] px-6 font-semibold"
                style={{ backgroundColor: "#0052ff" }}
                asChild
              >
                <Link href="/instrutor/cursos/novo">Criar primeiro curso</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium line-clamp-1">{course.title}</h3>
                      <Badge variant={course.isPublished ? "default" : "secondary"} className="text-xs flex-shrink-0">
                        {course.isPublished ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments} alunos
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {course._count.reviews} avaliações
                      </span>
                      <span>{course.isFree ? "Grátis" : `R$ ${course.price.toFixed(2).replace(".", ",")}`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/cursos/${course.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/instrutor/cursos/${course.id}`}>
                        <Pencil className="h-4 w-4" />
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
