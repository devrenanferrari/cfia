import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { NotificationsClient } from "@/components/community/notifications-client";

export const metadata = { title: "Notificações | CFIA" };

export default async function NotificacoesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/notificacoes");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const serialized = notifications.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }));

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[700px] px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5" style={{ color: "#0f62fe" }} />
          <h1 className="text-2xl font-bold" style={{ color: "#161616" }}>Notificações</h1>
        </div>
        <NotificationsClient initialNotifications={serialized} />
      </div>
    </div>
  );
}
