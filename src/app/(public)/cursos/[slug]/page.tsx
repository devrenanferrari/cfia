export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EnrollButton } from "@/components/enroll-button";
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Code,
  Star,
  Users,
} from "lucide-react";

const levelLabel: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

async function getCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      instructor: { select: { id: true, name: true, image: true, bio: true } },
      category: { select: { name: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, duration: true, isFree: true, type: true },
          },
        },
      },
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
      },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) notFound();

  const session = await getServerSession(authOptions);

  const enrollment = session
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      })
    : null;

  const isSubscribed = session?.user?.subscriptionStatus === "ACTIVE";

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const avgRating =
    course.reviews.length > 0
      ? (course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna principal */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {course.category && (
                <Badge variant="secondary">{course.category.name}</Badge>
              )}
              <Badge variant="outline">{levelLabel[course.level] ?? course.level}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            {course.description && (
              <p className="text-muted-foreground text-lg">{course.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course._count.enrollments} alunos
              </span>
              {avgRating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {avgRating} ({course._count.reviews} avaliações)
                </span>
              )}
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {totalLessons} aulas
              </span>
              {course.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.round(course.duration / 60)}h de conteúdo
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Instrutor: <span className="font-medium text-foreground">{course.instructor.name}</span>
            </p>
          </div>

          <Separator className="my-6" />

          {/* Currículo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Currículo do curso</h2>
            <div className="space-y-3">
              {course.modules.map((mod) => (
                <details key={mod.id} className="border rounded-lg group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-medium hover:bg-muted/50 transition-colors">
                    <span>{mod.title}</span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{mod.lessons.length} aulas</span>
                      <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <ul className="border-t divide-y">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className={enrollment || lesson.isFree ? "" : "text-muted-foreground"}>
                            {lesson.title}
                          </span>
                          {lesson.isFree && (
                            <Badge variant="outline" className="text-xs">Grátis</Badge>
                          )}
                        </div>
                        {lesson.duration && (
                          <span className="text-muted-foreground">{lesson.duration} min</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          {/* Sobre o instrutor */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Sobre o instrutor</h2>
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xl font-bold text-muted-foreground overflow-hidden">
                {course.instructor.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.instructor.image} alt={course.instructor.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  course.instructor.name?.[0]?.toUpperCase() ?? "I"
                )}
              </div>
              <div>
                <p className="font-semibold">{course.instructor.name}</p>
                {course.instructor.bio && (
                  <p className="text-sm text-muted-foreground mt-1">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Avaliações */}
          {course.reviews.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Avaliações dos alunos
                {avgRating && (
                  <span className="ml-2 text-yellow-500 text-base">★ {avgRating}</span>
                )}
              </h2>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold overflow-hidden">
                        {review.user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          review.user.name?.[0]?.toUpperCase() ?? "A"
                        )}
                      </div>
                      <span className="font-medium text-sm">{review.user.name}</span>
                      <span className="text-yellow-500 text-sm">{"★".repeat(review.rating)}</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar de compra */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-2xl p-6 shadow-sm bg-white">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/40 rounded-lg mb-4 flex items-center justify-center">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Code className="h-16 w-16 text-primary/50" />
              )}
            </div>
            <div className="mb-4">
              {course.isFree ? (
                <span className="text-2xl font-bold text-green-600">Grátis</span>
              ) : isSubscribed ? (
                <div>
                  <span
                    className="text-sm font-semibold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#05966915", color: "#059669" }}
                  >
                    Acesso liberado
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-2xl font-bold">Em breve</span>
                  <p className="text-xs mt-1" style={{ color: "#5b616e" }}>
                    Este curso ainda nao esta com acesso gratuito liberado.
                  </p>
                </div>
              )}
            </div>
            <EnrollButton
              courseId={course.id}
              courseSlug={course.slug}
              isEnrolled={!!enrollment}
              isFree={course.isFree}
              isLoggedIn={!!session}
              isSubscribed={!!isSubscribed}
            />
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {totalLessons} aulas
              </li>
              {course.duration && (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {Math.round(course.duration / 60)}h de conteúdo
                </li>
              )}
              <li className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificado de conclusão
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
