import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Clock, Check } from "lucide-react";
import { ConnectionActions } from "@/components/community/connection-actions";

export const metadata = { title: "Conexões | CFIA" };

function initials(name: string | null | undefined) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") ?? "?";
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "hoje";
  if (d < 7) return `${d}d atrás`;
  if (d < 30) return `${Math.floor(d / 7)}sem atrás`;
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export default async function ConexoesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar?callbackUrl=/conexoes");

  const connections = await prisma.connection.findMany({
    where: { OR: [{ fromId: session.user.id }, { toId: session.user.id }] },
    orderBy: { updatedAt: "desc" },
    include: {
      from: { select: { id: true, name: true, role: true, _count: { select: { posts: true } } } },
      to: { select: { id: true, name: true, role: true, _count: { select: { posts: true } } } },
    },
  });

  const accepted = connections.filter((c) => c.status === "ACCEPTED");
  const pendingReceived = connections.filter((c) => c.status === "PENDING" && c.toId === session.user.id);
  const pendingSent = connections.filter((c) => c.status === "PENDING" && c.fromId === session.user.id);

  function otherUser(c: (typeof connections)[0]) {
    return c.fromId === session!.user.id ? c.to : c.from;
  }

  function Section({ title, icon: Icon, items, type }: {
    title: string;
    icon: React.ElementType;
    items: typeof connections;
    type: "accepted" | "received" | "sent";
  }) {
    if (items.length === 0) return null;
    return (
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-4 w-4" style={{ color: "#0f62fe" }} />
          <h2 className="text-sm font-bold" style={{ color: "#161616" }}>{title}</h2>
          <span className="text-xs font-mono px-2 py-0.5" style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}>{items.length}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((c) => {
            const user = otherUser(c);
            return (
              <div key={c.id} className="bg-white border border-[#e0e0e0] p-4 flex items-start gap-3">
                <Link href={`/u/${user.id}`}>
                  <div className="h-11 w-11 rounded-full flex items-center justify-center font-bold shrink-0 hover:opacity-90 transition-opacity" style={{ backgroundColor: "#0f62fe", color: "#fff", fontSize: 14 }}>
                    {initials(user.name)}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/u/${user.id}`} className="text-sm font-bold hover:text-[#0f62fe] transition-colors block truncate" style={{ color: "#161616" }}>
                    {user.name ?? "Usuário"}
                  </Link>
                  <p className="text-xs" style={{ color: "#8d8d8d" }}>
                    {user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"} · {user._count.posts} post{user._count.posts !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: "#a8a8a8" }}>
                    {type === "accepted" ? <span className="flex items-center gap-1"><Check className="h-3 w-3" style={{ color: "#24a148" }} /> Conectado {timeAgo(c.updatedAt)}</span>
                      : type === "received" ? `Pedido recebido ${timeAgo(c.createdAt)}`
                        : `Pedido enviado ${timeAgo(c.createdAt)}`}
                  </p>
                </div>
                <ConnectionActions connectionId={c.id} type={type} />
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  const totalConnections = accepted.length;

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[900px] px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#161616" }}>Minhas conexões</h1>
          <p className="text-sm" style={{ color: "#8d8d8d" }}>
            {totalConnections} conexão{totalConnections !== 1 ? "ões" : ""} ativa{totalConnections !== 1 ? "s" : ""}
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="bg-white border border-[#e0e0e0] p-12 text-center">
            <Users className="h-10 w-10 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
            <p className="text-base font-bold mb-2" style={{ color: "#161616" }}>Nenhuma conexão ainda</p>
            <p className="text-sm mb-4" style={{ color: "#8d8d8d" }}>Explore a comunidade e conecte-se com outros membros.</p>
            <Link href="/comunidade" className="inline-flex items-center gap-2 text-xs font-bold px-5 h-9 transition-colors hover:bg-[#0353e9]" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
              Ir para a comunidade →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <Section title="Pedidos recebidos" icon={Clock} items={pendingReceived} type="received" />
            <Section title="Pedidos enviados" icon={Clock} items={pendingSent} type="sent" />
            <Section title="Conexões aceitas" icon={Users} items={accepted} type="accepted" />
          </div>
        )}
      </div>
    </div>
  );
}
