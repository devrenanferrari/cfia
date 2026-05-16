import { prisma } from "./prisma";
import { pusherServer } from "./pusher";

type NotificationType =
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "POST_COMMENT"
  | "POST_LIKE"
  | "NEW_MESSAGE";

export async function notify(
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  const notification = await prisma.notification.create({
    data: { userId, type, message, link },
  });

  try {
    await pusherServer.trigger(`private-user-${userId}`, "notification", notification);
  } catch {
    // Pusher não configurado ou falhou — notificação salva no DB, sem problema
  }

  return notification;
}
