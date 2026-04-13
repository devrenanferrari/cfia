export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, Pencil, PlusCircle, Users } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus cursos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {courses.length} curso{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/instrutor/cursos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo curso
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-4 opacity-30" />
            <p className="mb-4 font-medium">Você ainda não tem nenhum curso</p>
            <Button asChild>
              <Link href="/instrutor/cursos/novo">Criar primeiro curso</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                      <Badge
                        variant={course.isPublished ? "default" : "secondary"}
                        className="text-xs flex-shrink-0"
                      >
                        {course.isPublished ? "✓ Publicado" : "Rascunho"}
                      </Badge>
                      {course.category && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {course.category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course._count.modules} módulos
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments} alunos
                      </span>
                      <span className="text-xs">
                        {course.isFree ? "Grátis" : `R$ ${course.price.toFixed(2).replace(".", ",")}`}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild title="Ver como aluno">
                      <Link href={`/cursos/${course.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/instrutor/cursos/${course.id}`}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
