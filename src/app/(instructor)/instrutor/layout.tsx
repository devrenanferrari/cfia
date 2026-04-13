import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { InstructorSidebar } from "@/components/instructor-sidebar";
import { Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/instrutor");

  // Check if user is INSTRUCTOR or ADMIN
  if (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex gap-8 flex-1">
          <InstructorSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </>
    );
  }

  // Check for pending instructor application
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { instructorStatus: true },
  });


  if (dbUser?.instructorStatus === "PENDING") {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#0052ff15" }}
            >
              <Clock className="h-10 w-10" style={{ color: "#0052ff" }} />
            </div>
            <h1 className="text-2xl font-bold mb-3">Candidatura em análise</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Sua candidatura a instrutor está sendo analisada pela nossa equipe.
              Entraremos em contato pelo seu email em até 3 dias úteis.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[56px] text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0052ff" }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Ir para meu painel
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Regular student — redirect to seja-instrutor or dashboard
  redirect("/seja-instrutor");
}
