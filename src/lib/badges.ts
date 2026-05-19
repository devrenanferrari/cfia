import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

interface BadgeDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  xpValue: number;
  check: (userId: string) => Promise<boolean>;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    slug: "first-post",
    name: "Primeira Publicação",
    icon: "✍️",
    description: "Publicou o primeiro post na comunidade",
    xpValue: 20,
    check: async (userId) => {
      const count = await prisma.post.count({ where: { authorId: userId } });
      return count >= 1;
    },
  },
  {
    slug: "10-posts",
    name: "Prolífico",
    icon: "📝",
    description: "Publicou 10 posts na comunidade",
    xpValue: 50,
    check: async (userId) => {
      const count = await prisma.post.count({ where: { authorId: userId } });
      return count >= 10;
    },
  },
  {
    slug: "first-comment",
    name: "Comentarista",
    icon: "💬",
    description: "Fez o primeiro comentário",
    xpValue: 10,
    check: async (userId) => {
      const count = await prisma.postComment.count({ where: { authorId: userId } });
      return count >= 1;
    },
  },
  {
    slug: "10-comments",
    name: "Engajado",
    icon: "🗣️",
    description: "Fez 10 comentários na comunidade",
    xpValue: 30,
    check: async (userId) => {
      const count = await prisma.postComment.count({ where: { authorId: userId } });
      return count >= 10;
    },
  },
  {
    slug: "first-connection",
    name: "Networker",
    icon: "🤝",
    description: "Fez a primeira conexão na plataforma",
    xpValue: 15,
    check: async (userId) => {
      const count = await prisma.connection.count({
        where: { status: "ACCEPTED", OR: [{ fromId: userId }, { toId: userId }] },
      });
      return count >= 1;
    },
  },
  {
    slug: "5-connections",
    name: "Bem Conectado",
    icon: "🌐",
    description: "Tem 5 conexões aceitas",
    xpValue: 40,
    check: async (userId) => {
      const count = await prisma.connection.count({
        where: { status: "ACCEPTED", OR: [{ fromId: userId }, { toId: userId }] },
      });
      return count >= 5;
    },
  },
  {
    slug: "10-likes-received",
    name: "Popular",
    icon: "❤️",
    description: "Recebeu 10 curtidas nos seus posts",
    xpValue: 35,
    check: async (userId) => {
      const posts = await prisma.post.findMany({ where: { authorId: userId }, select: { id: true } });
      const count = await prisma.postVote.count({
        where: { postId: { in: posts.map((p) => p.id) }, value: 1 },
      });
      return count >= 10;
    },
  },
  {
    slug: "level-5",
    name: "Veterano",
    icon: "⭐",
    description: "Atingiu o nível 5",
    xpValue: 0,
    check: async (userId) => {
      const xp = await prisma.userXP.findUnique({ where: { userId } });
      return (xp?.level ?? 1) >= 5;
    },
  },
];

export async function checkAndAwardBadges(userId: string) {
  const existing = await prisma.userBadge.findMany({
    where: { userId },
    select: { badge: { select: { slug: true } } },
  });
  const earned = new Set(existing.map((b) => b.badge.slug));

  for (const def of BADGE_DEFS) {
    if (earned.has(def.slug)) continue;

    const qualifies = await def.check(userId);
    if (!qualifies) continue;

    const badge = await prisma.badge.upsert({
      where: { slug: def.slug },
      update: {},
      create: { slug: def.slug, name: def.name, icon: def.icon, description: def.description, xpValue: def.xpValue },
    });

    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });

    if (def.xpValue > 0) {
      await prisma.userXP.upsert({
        where: { userId },
        update: { xp: { increment: def.xpValue } },
        create: { userId, xp: def.xpValue, level: 1 },
      });
    }

    await notify(
      userId,
      "POST_LIKE",
      `🏆 Badge conquistada: "${def.icon} ${def.name}" — ${def.description}`,
      `/u/${userId}`
    );
  }
}
