import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Code, Search, Star, Users } from "lucide-react";

interface SearchParams {
  q?: string;
  categoria?: string;
  nivel?: string;
}

async function getCourses(params: SearchParams) {
  const where: Record<string, unknown> = { isPublished: true };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }
  if (params.categoria) {
    where.category = { slug: params.categoria };
  }
  if (params.nivel) {
    where.level = params.nivel.toUpperCase();
  }

  return prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
}

const levelLabel: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const courses = await getCourses(params);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos os cursos</h1>
        <p className="text-muted-foreground">
          {courses.length} curso{courses.length !== 1 ? "s" : ""} disponíve{courses.length !== 1 ? "is" : "l"}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2" method="GET">
          <Input
            name="q"
            placeholder="Buscar cursos..."
            defaultValue={params.q}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!params.nivel ? "secondary" : "outline"}
            size="sm"
            asChild
          >
            <Link href="/cursos">Todos</Link>
          </Button>
          {["beginner", "intermediate", "advanced"].map((n) => (
            <Button
              key={n}
              variant={params.nivel === n ? "secondary" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/cursos?nivel=${n}`}>{levelLabel[n.toUpperCase()]}</Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar de categorias */}
        {categories.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <h3 className="font-semibold mb-3 text-sm">Categorias</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/cursos"
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    !params.categoria
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Todos
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/cursos?categoria=${cat.slug}`}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      params.categoria === cat.slug
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Grid de cursos */}
        <div className="flex-1">
          {courses.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Nenhum curso encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/40 rounded-t-lg flex items-center justify-center">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <Code className="h-12 w-12 text-primary/60" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs">{course.category.name}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {levelLabel[course.level] ?? course.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base line-clamp-2 mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">por {course.instructor.name}</p>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {course._count.reviews > 0 ? "4.5" : "Novo"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="font-bold">
                      {course.isFree ? (
                        <span className="text-green-600">Grátis</span>
                      ) : (
                        <span>R$ {course.price.toFixed(2).replace(".", ",")}</span>
                      )}
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/cursos/${course.slug}`}>Ver curso</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
