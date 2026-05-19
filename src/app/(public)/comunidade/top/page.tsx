import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Trophy, Zap, Users, PenLine } from "lucide-react";

export const metadata = { title: "Leaderboard | Comunidade CFIA" };

function initials(name: string | null | undefined) {
  return name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") ?? "?";
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const [topXP, topPosts, topConnections] = await Promise.all([
    prisma.userXP.findMany({
      orderBy: { xp: "desc" },
      take: 20,
      include: {
        user: {
          select: {
            id: true, name: true, role: true,
            _count: { select: { posts: true } },
          },
        },
      },
    }),
    prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.connection.groupBy({
      by: ["fromId"],
      where: { status: "ACCEPTED" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  const postAuthorIds = topPosts.map((p) => p.authorId);
  const connUserIds = topConnections.map((c) => c.fromId);

  const [postUsers, connUsers] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: postAuthorIds } }, select: { id: true, name: true, role: true } }),
    prisma.user.findMany({ where: { id: { in: connUserIds } }, select: { id: true, name: true, role: true } }),
  ]);

  const postUserMap = new Map(postUsers.map((u) => [u.id, u]));
  const connUserMap = new Map(connUsers.map((u) => [u.id, u]));

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1000px] px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-6 w-6" style={{ color: "#0f62fe" }} />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#161616" }}>Leaderboard</h1>
            <p className="text-sm" style={{ color: "#8d8d8d" }}>Os membros mais ativos da comunidade CFIA</p>
          </div>
          <Link href="/comunidade" className="ml-auto text-xs font-bold hover:underline" style={{ color: "#0f62fe" }}>
            ← Comunidade
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Top XP */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e0e0e0]">
                <Zap className="h-4 w-4" style={{ color: "#0f62fe" }} />
                <h2 className="text-sm font-bold" style={{ color: "#161616" }}>Ranking de XP</h2>
              </div>
              <div>
                {topXP.map((entry, i) => {
                  const level = Math.floor(entry.xp / 100) + 1;
                  const xpToNext = level * 100;
                  const pct = Math.min(100, Math.round((entry.xp / xpToNext) * 100));
                  return (
                    <Link
                      key={entry.userId}
                      href={`/u/${entry.userId}`}
                      className="flex items-center gap-3 px-5 py-3 border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors group last:border-0"
                    >
                      <span className="w-8 text-center font-mono text-sm font-bold shrink-0" style={{ color: i < 3 ? "#0f62fe" : "#8d8d8d" }}>
                        {i < 3 ? MEDAL[i] : `#${i + 1}`}
                      </span>
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ backgroundColor: i === 0 ? "#f1c21b" : i === 1 ? "#c6c6c6" : i === 2 ? "#a87c52" : "#0f62fe", color: "#fff" }}
                      >
                        {initials(entry.user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>
                          {entry.user.name ?? "Usuário"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#e0e0e0", maxWidth: 80 }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: "#0f62fe" }} />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: "#8d8d8d" }}>Nível {level}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: "#0f62fe" }}>{entry.xp.toLocaleString("pt-BR")}</p>
                        <p className="text-[10px]" style={{ color: "#8d8d8d" }}>XP</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar rankings */}
          <div className="flex flex-col gap-4">

            {/* Top posts */}
            <div className="bg-white border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e0e0e0]">
                <PenLine className="h-4 w-4" style={{ color: "#0f62fe" }} />
                <h2 className="text-sm font-bold" style={{ color: "#161616" }}>Mais posts</h2>
              </div>
              <div>
                {topPosts.map((entry, i) => {
                  const user = postUserMap.get(entry.authorId);
                  if (!user) return null;
                  return (
                    <Link key={entry.authorId} href={`/u/${entry.authorId}`}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors group last:border-0">
                      <span className="w-6 text-center text-xs font-mono font-bold shrink-0" style={{ color: i < 3 ? "#0f62fe" : "#8d8d8d" }}>
                        {i < 3 ? MEDAL[i] : `${i + 1}`}
                      </span>
                      <div className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
                        {initials(user.name)}
                      </div>
                      <p className="flex-1 text-xs font-semibold truncate group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>{user.name}</p>
                      <span className="text-xs font-bold shrink-0" style={{ color: "#0f62fe" }}>{entry._count.id}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Top conexões */}
            <div className="bg-white border border-[#e0e0e0]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e0e0e0]">
                <Users className="h-4 w-4" style={{ color: "#0f62fe" }} />
                <h2 className="text-sm font-bold" style={{ color: "#161616" }}>Mais conectados</h2>
              </div>
              <div>
                {topConnections.map((entry, i) => {
                  const user = connUserMap.get(entry.fromId);
                  if (!user) return null;
                  return (
                    <Link key={entry.fromId} href={`/u/${entry.fromId}`}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors group last:border-0">
                      <span className="w-6 text-center text-xs font-mono font-bold shrink-0" style={{ color: i < 3 ? "#0f62fe" : "#8d8d8d" }}>
                        {i < 3 ? MEDAL[i] : `${i + 1}`}
                      </span>
                      <div className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
                        {initials(user.name)}
                      </div>
                      <p className="flex-1 text-xs font-semibold truncate group-hover:text-[#0f62fe] transition-colors" style={{ color: "#161616" }}>{user.name}</p>
                      <span className="text-xs font-bold shrink-0" style={{ color: "#0f62fe" }}>{entry._count.id}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
