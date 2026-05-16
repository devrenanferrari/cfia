import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ArrowRight } from "lucide-react";

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export const metadata = { title: "Chat | Comunidade CFIA" };

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/comunidade/chat");

  const rooms = await prisma.chatRoom.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { author: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white min-h-screen">
      <section
        className="pt-20 pb-12 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: "#8d8d8d" }}
          >
            <ArrowLeft className="h-4 w-4" /> Comunidade
          </Link>
          <h1
            className="text-4xl font-light text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Chat privado
          </h1>
          <p className="mt-3 text-[#8d8d8d] text-sm">
            Suas conversas privadas com outros membros da comunidade.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1584px] px-4 md:px-8 py-12">
        {rooms.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#e0e0e0]">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#c6c6c6" }} />
            <p className="text-lg font-light mb-2" style={{ color: "#161616" }}>Nenhuma conversa ainda.</p>
            <p className="text-sm mb-6" style={{ color: "#8d8d8d" }}>
              Você pode iniciar uma conversa a partir do perfil de outro membro.
            </p>
            <Link
              href="/comunidade"
              className="inline-flex items-center gap-2 h-10 px-6 text-sm font-semibold border border-[#161616] hover:bg-[#161616] hover:text-white transition-colors"
              style={{ color: "#161616" }}
            >
              Ver comunidade <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0] max-w-2xl">
            {rooms.map((room) => {
              const other = room.members.find((m) => m.userId !== session.user.id);
              const lastMsg = room.messages[0];
              return (
                <Link
                  key={room.id}
                  href={`/comunidade/chat/${room.id}`}
                  className="flex items-center gap-4 bg-white px-5 py-4 hover:bg-[#f4f4f4] transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: "#edf5ff", color: "#0f62fe" }}
                  >
                    {other?.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#161616" }}>
                      {other?.user.name ?? "Usuário"}
                    </p>
                    {lastMsg && (
                      <p className="text-xs truncate" style={{ color: "#8d8d8d" }}>
                        {lastMsg.author.name}: {lastMsg.body}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {lastMsg && (
                      <span className="text-[10px]" style={{ color: "#8d8d8d" }}>
                        {timeAgo(lastMsg.createdAt)}
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4" style={{ color: "#8d8d8d" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
