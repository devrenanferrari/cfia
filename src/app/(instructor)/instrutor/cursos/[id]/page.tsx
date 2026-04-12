import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CourseEditor } from "./course-editor";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar");

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
      category: true,
    },
  });

  if (!course) notFound();
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/instrutor");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <CourseEditor
      course={course}
      categories={categories}
      bunnyLibraryId={process.env.BUNNY_STREAM_LIBRARY_ID ?? ""}
    />
  );
}
