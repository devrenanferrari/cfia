export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CourseEditor } from "./course-editor";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar");

  const { id } = await params;
  let quizFeatureError: string | null = null;
  let course;

  try {
    course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                quiz: {
                  include: {
                    questions: {
                      orderBy: { order: "asc" },
                      include: {
                        options: {
                          orderBy: { order: "asc" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        category: true,
      },
    });
  } catch (error) {
    quizFeatureError = getPrismaErrorMessage(error);
    if (!quizFeatureError) throw error;

    course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        category: true,
      },
    });

    if (course) {
      course = {
        ...course,
        modules: course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            quiz: null,
          })),
        })),
      };
    }
  }

  if (!course) notFound();
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/instrutor");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <CourseEditor
      course={course}
      categories={categories}
      quizFeatureError={quizFeatureError}
    />
  );
}
