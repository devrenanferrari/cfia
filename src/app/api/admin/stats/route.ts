import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const [
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    activeSubscriptions,
    pendingInstructors,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
    prisma.user.count({ where: { subscriptionStatus: "ACTIVE" } }),

    prisma.user.count({ where: { instructorStatus: "PENDING" } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    totalStudents,
    totalInstructors,
    totalCourses,
    totalEnrollments,
    activeSubscriptions,
    pendingInstructors,
    recentUsers,
  });
}
