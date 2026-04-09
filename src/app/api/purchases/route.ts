import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const purchases = await db.purchase.findMany({
      where: {
        buyerId: session.user.id,
        status: "COMPLETED",
        refundedAt: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        ruleset: {
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true } },
            tags: { include: { tag: { select: { name: true } } } },
          },
        },
      },
    });

    const items = purchases.map((p) => ({
      ...p.ruleset,
      tags: p.ruleset.tags.map((t) => t.tag.name),
      currentUserAccess: "PURCHASED" as const,
      currentUserSaved: false,
      currentUserVoted: false,
      purchasedAt: p.createdAt.toISOString(),
      pricePaid: p.amount,
    }));

    return success({ items, total: items.length });
  } catch {
    return errors.internal();
  }
}
