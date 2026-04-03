import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: discussionId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { bodyText, parentReplyId } = body;

    if (!bodyText) return errors.validation("Body is required");

    const discussion = await db.discussion.findUnique({
      where: { id: discussionId },
      select: { id: true, authorId: true, title: true },
    });
    if (!discussion) return errors.notFound("Discussion not found");

    // Max 2 levels deep
    if (parentReplyId) {
      const parent = await db.discussionReply.findUnique({
        where: { id: parentReplyId },
        select: { parentReplyId: true },
      });
      if (parent?.parentReplyId) {
        return errors.validation("Maximum reply depth is 2 levels");
      }
    }

    const reply = await db.discussionReply.create({
      data: {
        discussionId,
        authorId: session.user.id,
        body: bodyText,
        parentReplyId: parentReplyId || null,
      },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    if (discussion.authorId !== session.user.id) {
      await createNotification(discussion.authorId, "DISCUSSION_REPLY", {
        discussionId,
        discussionTitle: discussion.title,
        replierName: session.user.name,
      });
    }

    return success(reply, 201);
  } catch {
    return errors.internal();
  }
}
