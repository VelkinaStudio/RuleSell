# Backend Handoff: Stripe Migration & UK Company Setup

## Current State
The backend uses **LemonSqueezy** for buyer payments and webhook handling. The decision is to migrate to **Stripe** for a UK-registered company, using Stripe Connect Express for seller payouts.

## Why Switch
- UK company → Stripe has first-class UK support with GBP settlement
- Stripe Connect Express → handles seller KYC, identity verification, and payouts per-region
- Single platform for both buyer payments and seller payouts
- Better API, more control, widely trusted

## What Needs to Change

### 1. Buyer Payments (replace LemonSqueezy)

**Remove:**
- `@lemonsqueezy/lemonsqueezy.js` dependency
- `src/app/api/webhooks/lemonsqueezy/route.ts`
- All LemonSqueezy references in `src/app/api/checkout/`

**Add:**
- Stripe Checkout Sessions for one-time purchases
- Stripe Subscriptions for subscription items
- Stripe webhook handler at `/api/webhooks/stripe`

```typescript
// Checkout session creation
const session = await stripe.checkout.sessions.create({
  mode: 'payment', // or 'subscription'
  line_items: [{ price: stripePriceId, quantity: 1 }],
  payment_intent_data: {
    application_fee_amount: Math.round(price * 0.15 * 100), // 15% platform fee
    transfer_data: { destination: sellerStripeAccountId },
  },
  success_url: `${baseUrl}/purchases?success=true`,
  cancel_url: `${baseUrl}/r/${rulesetSlug}`,
});
```

### 2. Seller Payouts (Stripe Connect Express)

**New endpoint: `POST /api/stripe/connect/onboard`**
```typescript
// Create Connect account + onboarding link
const account = await stripe.accounts.create({
  type: 'express',
  country: kycData.country, // ISO-2
  email: user.email,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  business_type: 'individual', // or 'company'
});

const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${baseUrl}/dashboard/settings/seller?refresh=true`,
  return_url: `${baseUrl}/dashboard/settings/seller?connected=true`,
  type: 'account_onboarding',
});

// Redirect user to accountLink.url
```

**New endpoint: `GET /api/stripe/connect/status`**
Returns the seller's Stripe Connect account status (pending, verified, restricted).

**New endpoint: `POST /api/stripe/connect/dashboard`**
Creates a Stripe Express Dashboard login link for sellers to manage their account.

### 3. Platform Fee Structure

| Period | Platform Fee | Seller Gets |
|--------|-------------|-------------|
| First 6 months | 10% | 90% |
| After 6 months | 15% | 85% |
| Pro seller | 12% | 88% |

Implement via `application_fee_amount` on PaymentIntents. The fee is calculated at checkout time and split automatically by Stripe.

### 4. Payout Schedule

- **Frequency**: Monthly (Stripe Connect default is rolling, change to monthly)
- **Minimum**: $50 (USD equivalent)
- **Hold period**: 30 days from purchase (for chargeback protection)
- **Currency**: Seller receives in their local currency (Stripe handles conversion)

Configure via:
```typescript
await stripe.accounts.update(accountId, {
  settings: {
    payouts: {
      schedule: { interval: 'monthly', monthly_anchor: 1 },
    },
  },
});
```

### 5. Refund Policy

- 14-day refund window if item not installed
- 1 refund per item per account
- Refunds deduct from seller balance + $5 admin fee on chargebacks
- Implement via Stripe Refunds API with `reverse_transfer: true`

### 6. Prisma Schema Changes

```prisma
model StripeAccount {
  id                String   @id @default(cuid())
  userId            String   @unique
  stripeAccountId   String   @unique
  status            String   @default("pending") // pending, verified, restricted, disabled
  country           String
  payoutsEnabled    Boolean  @default(false)
  chargesEnabled    Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
}
```

Update existing `Purchase` model:
- Replace `lemonSqueezyOrderId` with `stripePaymentIntentId`
- Replace `lemonSqueezyCustomerId` with `stripeCustomerId`
- Add `stripeRefundId` field

### 7. Webhook Events to Handle

```typescript
// /api/webhooks/stripe
switch (event.type) {
  case 'checkout.session.completed':
    // Create Purchase record, grant access
    break;
  case 'payment_intent.succeeded':
    // Update Purchase status
    break;
  case 'charge.refunded':
    // Process refund, revoke access, update seller balance
    break;
  case 'account.updated':
    // Update seller's StripeAccount status
    break;
  case 'payout.paid':
    // Record payout in AffiliatePayout / SellerPayout
    break;
}
```

### 8. UK Company Requirements

**For Stripe UK:**
- Company registration with Companies House (Ltd or LLP)
- UK bank account for platform settlement
- VAT registration if revenue > £90,000/year (2026 threshold)
- Stripe handles buyer VAT collection via Stripe Tax

**Environment variables needed:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
```

### 9. Frontend Already Prepared

The frontend KYC flow at `/dashboard/settings/seller` is ready:
- 4-stage seller onboarding (Publish → KYC → Review → Verified)
- Region-aware compliance notices (EU/UK/US/Other)
- Stripe Connect redirect placeholder (comment in `kyc-form.tsx` line 100)
- Connected accounts section showing Stripe status

The backend team needs to:
1. Remove LemonSqueezy integration
2. Add Stripe Checkout for purchases
3. Add Stripe Connect Express for seller onboarding
4. Add webhook handler for Stripe events
5. Create the StripeAccount Prisma model
6. Wire the KYC form submission to create a Connect account + redirect
