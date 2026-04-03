import { db } from "@/lib/db";

export async function getPurchaseStatus(userId: string, rulesetId: string) {
  const purchase = await db.purchase.findFirst({
    where: { buyerId: userId, rulesetId },
    orderBy: { createdAt: "desc" },
    select: { status: true, accessType: true, accessExpiresAt: true },
  });

  if (!purchase) return { status: "NOT_FOUND" as const };

  if (purchase.status === "REFUNDED") return { status: "REFUNDED" as const };

  if (purchase.status === "COMPLETED") {
    if (purchase.accessType === "SUBSCRIPTION" && purchase.accessExpiresAt && purchase.accessExpiresAt < new Date()) {
      return { status: "EXPIRED" as const };
    }
    return { status: "COMPLETED" as const };
  }

  return { status: "PENDING" as const };
}

export async function getUserPurchases(userId: string) {
  return db.purchase.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ruleset: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          platform: true,
          type: true,
          author: { select: { name: true, username: true } },
        },
      },
    },
  });
}

export function calculatePlatformFee(amount: number, isPro: boolean): number {
  const rate = isPro
    ? parseFloat(process.env.PRO_COMMISSION_RATE || "0.10")
    : parseFloat(process.env.STANDARD_COMMISSION_RATE || "0.20");
  return Math.round(amount * rate * 100) / 100;
}
