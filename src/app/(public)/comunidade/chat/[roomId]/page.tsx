import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatWindow } from "@/components/community/chat-window";

export const metadata = { title: "Chat | Comunidade CFIA" };

export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/comunidade/chat");

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!room) notFound();

  const isMember = room.members.some((m) => m.userId === session.user.id);
  if (!isMember) notFound();

  const other = room.members.find((m) => m.userId !== session.user.id);

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[700px] px-4 py-6">
        <Link
          href="/comunidade/chat"
          className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-[#0f62fe]"
          style={{ color: "#8d8d8d" }}
        >
          <ArrowLeft className="h-4 w-4" /> Conversas
        </Link>

        <ChatWindow
          roomId={roomId}
          otherUser={{ id: other?.user.id ?? "", name: other?.user.name ?? null }}
        />
      </div>
    </div>
  );
}
