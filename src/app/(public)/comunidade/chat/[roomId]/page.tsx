import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatWindow } from "@/components/community/chat-window";

export const metadata = { title: "Chat | Comunidade CFIA" };

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/comunidade/chat");

  const room = await prisma.chatRoom.findUnique({
    where: { id: params.roomId },
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
    <div className="bg-white min-h-screen">
      <section
        className="pt-16 pb-8 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <Link
            href="/comunidade/chat"
            className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:text-white"
            style={{ color: "#8d8d8d" }}
          >
            <ArrowLeft className="h-4 w-4" /> Conversas
          </Link>
          <h1 className="text-2xl font-light text-white">
            {other?.user.name ?? "Usuário"}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-10">
        <div className="max-w-2xl">
          <ChatWindow
            roomId={params.roomId}
            otherUser={{ id: other?.user.id ?? "", name: other?.user.name ?? null }}
          />
        </div>
      </div>
    </div>
  );
}
