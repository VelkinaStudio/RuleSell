import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 20;

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.notification.count({ where: { userId: session.user.id, read: false } }),
    ]);

    const hasNext = notifications.length > pageSize;
    if (hasNext) notifications.pop();

    return success({
      notifications,
      unreadCount,
      nextCursor: hasNext && notifications.length > 0 ? notifications[notifications.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}
