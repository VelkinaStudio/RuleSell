import { db } from "@/lib/db";

export type AccessState =
  | "AUTHOR"
  | "PURCHASED"
  | "SUBSCRIPTION_ACTIVE"
  | "SUBSCRIPTION_EXPIRED"
  | "REFUNDED"
  | "FREE_DOWNLOAD"
  | "PUBLIC";

export async function resolveAccessState(
  rulesetId: string,
  rulesetAuthorId: string,
  rulesetPrice: number,
  userId?: string,
): Promise<AccessState> {
  // Not logged in
  if (!userId) return "PUBLIC";

  // Author always gets full access
  if (userId === rulesetAuthorId) return "AUTHOR";

  // Check for purchase
  const purchase = await db.purchase.findFirst({
    where: { buyerId: userId, rulesetId },
    orderBy: { createdAt: "desc" },
  });

  if (purchase) {
    if (purchase.status === "REFUNDED") return "REFUNDED";
    if (purchase.status === "COMPLETED") {
      if (purchase.accessType === "SUBSCRIPTION") {
        if (purchase.accessExpiresAt && purchase.accessExpiresAt < new Date()) {
          return "SUBSCRIPTION_EXPIRED";
        }
        return "SUBSCRIPTION_ACTIVE";
      }
      return "PURCHASED";
    }
  }

  // Free ruleset + logged in
  if (rulesetPrice === 0) return "FREE_DOWNLOAD";

  return "PUBLIC";
}

export function canViewFullContent(state: AccessState): boolean {
  return ["AUTHOR", "PURCHASED", "SUBSCRIPTION_ACTIVE", "FREE_DOWNLOAD"].includes(state);
}
