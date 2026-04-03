import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { calculatePlatformFee } from "@/lib/purchases/queries";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;

    if (!customData?.user_id || !customData?.ruleset_id) {
      return NextResponse.json({ error: "Missing custom data" }, { status: 400 });
    }

    const userId = customData.user_id;
    const rulesetId = customData.ruleset_id;
    const orderId = String(payload.data?.id || "");

    if (eventName === "order_created") {
      const amount = parseFloat(payload.data?.attributes?.total || "0") / 100;

      const ruleset = await db.ruleset.findUnique({
        where: { id: rulesetId },
        select: { authorId: true, author: { select: { role: true } } },
      });

      const isPro = ruleset?.author?.role === "PRO";
      const platformFee = calculatePlatformFee(amount, isPro);

      const existing = await db.purchase.findFirst({
        where: { buyerId: userId, rulesetId, lemonsqueezyOrderId: orderId },
      });

      if (existing) {
        await db.purchase.update({
          where: { id: existing.id },
          data: { status: "COMPLETED", amount, platformFee },
        });
      } else {
        await db.purchase.create({
          data: {
            buyerId: userId,
            rulesetId,
            amount,
            platformFee,
            lemonsqueezyOrderId: orderId,
            accessType: "LIFETIME",
            status: "COMPLETED",
          },
        });
      }

      // Update seller earnings
      if (ruleset) {
        await db.user.update({
          where: { id: ruleset.authorId },
          data: { totalEarnings: { increment: amount - platformFee } },
        });
      }

      // Update purchase count
      await db.ruleset.update({
        where: { id: rulesetId },
        data: { purchaseCount: { increment: 1 } },
      });

      // Log purchase event for trending
      await db.rulesetEvent.create({
        data: { rulesetId, type: "PURCHASE" },
      });
    }

    if (eventName === "order_refunded") {
      const purchase = await db.purchase.findFirst({
        where: { lemonsqueezyOrderId: orderId },
      });

      if (purchase) {
        await db.purchase.update({
          where: { id: purchase.id },
          data: { status: "REFUNDED", refundedAt: new Date() },
        });

        const ruleset = await db.ruleset.findUnique({
          where: { id: purchase.rulesetId },
          select: { authorId: true },
        });
        if (ruleset) {
          await db.user.update({
            where: { id: ruleset.authorId },
            data: { totalEarnings: { decrement: purchase.amount - purchase.platformFee } },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
