import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BookOpen, Star, Users, Award, ArrowRight, Zap, Brain, Code } from "lucide-react";

async function getHomeData() {
  const [featuredCourses, categories, stats] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        instructor: { select: { name: true, image: true } },
        category: { select: { name: true } },
        _count: { select: { enrollments: true, reviews: true } },
      },
    }),
    prisma.category.findMany({ take: 8, orderBy: { name: "asc" } }),
    Promise.all([
      prisma.course.count({ where: { isPublished: true } }),
      prisma.user.count(),
      prisma.enrollment.count(),
    ]),
  ]);

  return { featuredCourses, categories, stats };
}

export default async function HomePage() {
  const { featuredCourses, categories, stats } = await getHomeData();
  const [totalCourses, totalUsers, totalEnrollments] = stats;

  const levelLabel: Record<string, string> = {
    BEGINNER: "Iniciante",
    INTERMEDIATE: "Intermediário",
    ADVANCED: "Avançado",
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/30 to-background py-24 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Zap className="mr-1 h-3 w-3" />
            Plataforma de IA do Brasil
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Domine a{" "}
            <span className="text-primary">Inteligência Artificial</span>
            <br />
            com cursos práticos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Do zero ao avançado em Machine Learning, Deep Learning, LLMs e muito mais. Aprenda com projetos reais e conquiste certificados reconhecidos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/cursos">
                Explorar cursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cadastro">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/40 py-12 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">{totalCourses}+</div>
            <div className="text-muted-foreground mt-1">Cursos disponíveis</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">{totalUsers.toLocaleString("pt-BR")}+</div>
            <div className="text-muted-foreground mt-1">Alunos matriculados</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">{totalEnrollments.toLocaleString("pt-BR")}+</div>
            <div className="text-muted-foreground mt-1">Certificados emitidos</div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      {categories.length > 0 && (
        <section className="py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold mb-8">Explorar por categoria</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/cursos?categoria=${cat.slug}`}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:border-primary hover:shadow-sm transition-all"
                >
                  <Brain className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cursos em destaque */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Cursos em destaque</h2>
            <Button variant="ghost" asChild>
              <Link href="/cursos">
                Ver todos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Nenhum curso publicado ainda.</p>
              <Button asChild className="mt-4">
                <Link href="/instrutor/cursos/novo">Criar o primeiro curso</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
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
                    <h3 className="font-semibold text-base line-clamp-2 mb-2">{course.title}</h3>
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
                    <div className="font-bold text-lg">
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
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
        <div className="mx-auto max-w-2xl">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Pronto para começar sua jornada em IA?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Junte-se a milhares de alunos que já estão aprendendo Inteligência Artificial com o cfia.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cadastro">Criar conta grátis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
