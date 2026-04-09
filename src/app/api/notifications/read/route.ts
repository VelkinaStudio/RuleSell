import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const markReadSchema = z.object({
  ids: z.array(z.string()).max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const parsed = markReadSchema.safeParse(body);
    if (!parsed.success) return errors.validation("Invalid request");
    const { ids } = parsed.data;

    if (ids && ids.length > 0) {
      await db.notification.updateMany({
        where: { id: { in: ids }, userId: session.user.id },
        data: { read: true },
      });
    } else {
      await db.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
    }

    return success({ message: "Marked as read" });
  } catch {
    return errors.internal();
  }
}
