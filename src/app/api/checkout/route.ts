import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";
import { rateLimitWrite } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  rulesetId: z.string().min(1),
  variantId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rl = await rateLimitWrite(`checkout:${session.user.id}`);
    if (!rl.ok) return errors.rateLimited();

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return errors.validation("rulesetId is required");
    const { rulesetId, variantId } = parsed.data;

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { id: true, title: true, slug: true, price: true, authorId: true, status: true },
    });

    if (!ruleset || ruleset.status === "ARCHIVED") return errors.notFound("Ruleset not found");
    if (ruleset.authorId === session.user.id) return errors.validation("Cannot buy your own ruleset");
    if (ruleset.price === 0) return errors.validation("This ruleset is free");

    // Check if already purchased
    const existing = await db.purchase.findFirst({
      where: { buyerId: session.user.id, rulesetId, status: "COMPLETED" },
    });
    if (existing) return errors.conflict("Already purchased");

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const checkoutUrl = await createLemonSqueezyCheckout({
      storeId,
      variantId: variantId || process.env.LEMONSQUEEZY_DEFAULT_VARIANT_ID || "",
      userEmail: session.user.email!,
      userId: session.user.id,
      rulesetId: ruleset.id,
      rulesetTitle: ruleset.title,
    });

    return success({ checkoutUrl });
  } catch {
    return errors.internal();
  }
}
