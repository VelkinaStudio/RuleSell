import { lemonSqueezySetup, createCheckout, getOrder } from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
    initialized = true;
  }
}

export async function createLemonSqueezyCheckout(opts: {
  storeId: string;
  variantId: string;
  userEmail: string;
  userId: string;
  rulesetId: string;
  rulesetTitle: string;
}) {
  ensureInitialized();
  const { data, error } = await createCheckout(opts.storeId, opts.variantId, {
    checkoutData: {
      email: opts.userEmail,
      custom: {
        user_id: opts.userId,
        ruleset_id: opts.rulesetId,
      },
    },
    productOptions: {
      name: opts.rulesetTitle,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${opts.rulesetId}?purchase=success`,
    },
  });

  if (error) throw new Error(error.message);
  return data!.data.attributes.url;
}

export async function getLemonSqueezyOrder(orderId: string) {
  ensureInitialized();
  const { data, error } = await getOrder(orderId);
  if (error) throw new Error(error.message);
  return data!.data;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
