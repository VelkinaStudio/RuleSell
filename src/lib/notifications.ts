import { db } from "@/lib/db";
import type { NotificationType, Prisma } from "@/generated/prisma/client";

export async function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, unknown>,
) {
  // Check if user wants this notification type (in-app)
  const pref = await db.notificationPreference.findUnique({
    where: { userId_type: { userId, type } },
  });

  // Default to enabled if no preference set
  if (pref && !pref.inAppEnabled) return null;

  return db.notification.create({
    data: { userId, type, data: data as Prisma.InputJsonValue },
  });
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({
    where: { userId, read: false },
  });
}
