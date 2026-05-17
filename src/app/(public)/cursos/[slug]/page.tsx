export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EnrollButton } from "@/components/enroll-button";
import {
  Award,
  BookOpen,
  ChevronDown,
  Clock,
  Code,
  Star,
  Users,
  Video,
  FileText,
  FlaskConical,
} from "lucide-react";

const levelLabel: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

const lessonTypeIcon: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  VIDEO: Video,
  TEXT: FileText,
  NOTEBOOK: FlaskConical,
  QUIZ: BookOpen,
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
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="bg-[#161616] border-b border-[#393939]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            {/* Breadcrumb-style labels */}
            <div className="flex items-center gap-2 mb-4">
              {course.category && (
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#edf5ff20", color: "#78a9ff", border: "1px solid #78a9ff40" }}
                >
                  {course.category.name}
                </span>
              )}
              <span
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "#ffffff10", color: "#a8a8a8", border: "1px solid #ffffff20" }}
              >
                {levelLabel[course.level] ?? course.level}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug" style={{ color: "#f4f4f4", letterSpacing: "-0.01em" }}>
              {course.title}
            </h1>
            {course.description && (
              <p className="text-base mb-5 leading-relaxed" style={{ color: "#a8a8a8" }}>
                {course.description}
              </p>
            )}

            {/* Meta stats */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" style={{ color: "#a8a8a8" }}>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" style={{ color: "#78a9ff" }} />
                {course._count.enrollments} alunos
              </span>
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" style={{ color: "#f1c21b", fill: "#f1c21b" }} />
                  {avgRating} ({course._count.reviews} avaliações)
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" style={{ color: "#78a9ff" }} />
                {totalLessons} aulas
              </span>
              {course.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" style={{ color: "#78a9ff" }} />
                  {Math.round(course.duration / 60)}h de conteúdo
                </span>
              )}
            </div>

            <p className="text-sm mt-3" style={{ color: "#8d8d8d" }}>
              Instrutor: <span style={{ color: "#f4f4f4" }}>{course.instructor.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Currículo */}
            <div className="bg-white border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
                <BookOpen className="h-4 w-4" style={{ color: "#0f62fe" }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}>
                  Currículo do curso
                </span>
                <span className="ml-auto text-xs" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}>
                  {totalLessons} aulas
                </span>
              </div>

              <div className="divide-y divide-[#f4f4f4]">
                {course.modules.map((mod) => (
                  <details key={mod.id} className="group">
                    <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer list-none hover:bg-[#f4f4f4] transition-colors">
                      <span className="text-sm font-semibold" style={{ color: "#161616" }}>{mod.title}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs" style={{ color: "#8d8d8d", fontFamily: "var(--font-mono)" }}>
                          {mod.lessons.length} aula{mod.lessons.length !== 1 ? "s" : ""}
                        </span>
                        <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" style={{ color: "#8d8d8d" }} />
                      </div>
                    </summary>

                    <ul className="border-t border-[#f4f4f4]">
                      {mod.lessons.map((lesson) => {
                        const LessonIcon = lessonTypeIcon[lesson.type] ?? Code;
                        return (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between px-5 py-3 text-sm border-b border-[#f4f4f4] last:border-0"
                            style={{ backgroundColor: "#fafafa" }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <LessonIcon className="h-3.5 w-3.5 shrink-0" style={{ color: "#8d8d8d" }} />
                              <span
                                className="truncate"
                                style={{ color: enrollment || lesson.isFree ? "#161616" : "#8d8d8d" }}
                              >
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span
                                  className="text-[10px] font-semibold px-1.5 py-0.5 shrink-0"
                                  style={{ backgroundColor: "#defbe6", color: "#24a148" }}
                                >
                                  Grátis
                                </span>
                              )}
                            </div>
                            {lesson.duration && (
                              <span className="text-xs ml-3 shrink-0" style={{ color: "#8d8d8d", fontFamily: "var(--font-mono)" }}>
                                {lesson.duration}min
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))}
              </div>
            </div>

            {/* Sobre o instrutor */}
            <div className="bg-white border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}>
                  Sobre o instrutor
                </span>
              </div>
              <div className="p-5 flex items-start gap-4">
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center shrink-0 font-bold text-lg overflow-hidden"
                  style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                >
                  {course.instructor.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.instructor.image} alt={course.instructor.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    course.instructor.name?.[0]?.toUpperCase() ?? "I"
                  )}
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#161616" }}>{course.instructor.name}</p>
                  {course.instructor.bio && (
                    <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Avaliações */}
            {course.reviews.length > 0 && (
              <div className="bg-white border border-[#e0e0e0]">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}>
                    Avaliações dos alunos
                  </span>
                  {avgRating && (
                    <span className="ml-auto flex items-center gap-1 text-sm font-semibold" style={{ color: "#161616" }}>
                      <Star className="h-4 w-4" style={{ color: "#f1c21b", fill: "#f1c21b" }} />
                      {avgRating}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-[#f4f4f4]">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="p-5">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
                          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
                        >
                          {review.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            review.user.name?.[0]?.toUpperCase() ?? "A"
                          )}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: "#161616" }}>{review.user.name}</span>
                        <span className="text-sm ml-auto" style={{ color: "#f1c21b" }}>{"★".repeat(review.rating)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#e0e0e0]">
              {/* Thumbnail */}
              <div className="aspect-video overflow-hidden border-b border-[#e0e0e0]" style={{ backgroundColor: "#161616" }}>
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code className="h-12 w-12 opacity-20" style={{ color: "#ffffff" }} />
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Price / access */}
                <div className="mb-4">
                  {course.isFree ? (
                    <span className="text-2xl font-light" style={{ color: "#24a148", letterSpacing: "-0.01em" }}>Grátis</span>
                  ) : isSubscribed ? (
                    <span
                      className="inline-block text-sm font-semibold px-3 py-1.5"
                      style={{ backgroundColor: "#defbe6", color: "#24a148" }}
                    >
                      Acesso liberado pela assinatura
                    </span>
                  ) : (
                    <div>
                      <span className="text-2xl font-light" style={{ color: "#161616", letterSpacing: "-0.01em" }}>Em breve</span>
                      <p className="text-xs mt-1" style={{ color: "#8d8d8d" }}>
                        Este curso ainda não está com acesso liberado.
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

                {/* Course details */}
                <div className="mt-4 space-y-2.5 pt-4 border-t border-[#f4f4f4]">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
                    <BookOpen className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
                    {totalLessons} aulas
                  </div>
                  {course.duration && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
                      <Clock className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
                      {Math.round(course.duration / 60)}h de conteúdo
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#525252" }}>
                    <Award className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
                    Certificado de conclusão
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
