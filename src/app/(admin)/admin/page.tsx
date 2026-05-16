export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Users, BookOpen, TrendingUp, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

async function getStats() {
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
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return { totalStudents, totalInstructors, totalCourses, totalEnrollments, activeSubscriptions, pendingInstructors, recentUsers };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Notícias & Artigos", value: "Editorial", icon: BookOpen, href: "/admin/noticias", color: "#161616" },
    { label: "Alunos", value: stats.totalStudents, icon: Users, href: "/admin/alunos", color: "#0052ff" },
    { label: "Instrutores", value: stats.totalInstructors, icon: UserCheck, href: "/admin/instrutores", color: "#7c3aed" },
    { label: "Cursos publicados", value: stats.totalCourses, icon: BookOpen, href: "/admin/cursos", color: "#059669" },
    { label: "Matrículas", value: stats.totalEnrollments, icon: TrendingUp, href: "/admin/alunos", color: "#d97706" },
    { label: "Apoiadores ativos", value: stats.activeSubscriptions, icon: TrendingUp, href: "/admin/alunos", color: "#0891b2" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da plataforma cfia</p>
      </div>

      {/* Alert for pending instructors */}
      {stats.pendingInstructors > 0 && (
        <Link href="/admin/instrutores">
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {stats.pendingInstructors} candidatura{stats.pendingInstructors > 1 ? "s" : ""} de instrutor aguardando aprovação
            </p>
            <span className="ml-auto text-xs font-semibold text-amber-700 underline">Analisar →</span>
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <div className="bg-white p-6 rounded-2xl border hover:shadow-md transition-shadow">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value.toLocaleString("pt-BR")}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Usuários recentes</h2>
          <Link href="/admin/alunos" className="text-sm font-semibold" style={{ color: "#0052ff" }}>
            Ver todos →
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{u.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      u.role === "ADMIN" ? "#0052ff15" :
                      u.role === "INSTRUCTOR" ? "#7c3aed15" : "#05966915",
                    color:
                      u.role === "ADMIN" ? "#0052ff" :
                      u.role === "INSTRUCTOR" ? "#7c3aed" : "#059669",
                  }}
                >
                  {u.role === "STUDENT" ? "Aluno" : u.role === "INSTRUCTOR" ? "Instrutor" : "Admin"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
