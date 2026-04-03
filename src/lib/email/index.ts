import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "noreply@ruleset.ai";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your email — Ruleset",
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e5e5e5;">Verify your email</h2>
        <p style="color: #a3a3a3;">Click the link below to verify your email address:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #737373; font-size: 12px;">If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password — Ruleset",
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e5e5e5;">Reset your password</h2>
        <p style="color: #a3a3a3;">Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #737373; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPurchaseReceiptEmail(to: string, opts: {
  rulesetTitle: string;
  rulesetSlug: string;
  amount: number;
  orderId: string;
}) {
  const url = `${APP_URL}/r/${opts.rulesetSlug}`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Purchase confirmed: ${opts.rulesetTitle} — Ruleset`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e5e5e5;">Purchase Confirmed</h2>
        <p style="color: #a3a3a3;">You've successfully purchased:</p>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #e5e5e5; font-weight: bold; margin: 0 0 4px 0;">${opts.rulesetTitle}</p>
          <p style="color: #22c55e; margin: 0;">$${opts.amount.toFixed(2)}</p>
          <p style="color: #737373; font-size: 12px; margin: 8px 0 0 0;">Order: ${opts.orderId}</p>
        </div>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View & Download
        </a>
      </div>
    `,
  });
}

export async function sendSaleNotificationEmail(to: string, opts: {
  rulesetTitle: string;
  buyerName: string;
  amount: number;
  earnings: number;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `New sale: ${opts.rulesetTitle} — Ruleset`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e5e5e5;">You made a sale!</h2>
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="color: #e5e5e5; font-weight: bold; margin: 0 0 4px 0;">${opts.rulesetTitle}</p>
          <p style="color: #a3a3a3; margin: 0 0 4px 0;">Buyer: ${opts.buyerName}</p>
          <p style="color: #22c55e; margin: 0;">Your earnings: $${opts.earnings.toFixed(2)}</p>
        </div>
        <a href="${APP_URL}/dashboard/analytics" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Analytics
        </a>
      </div>
    `,
  });
}
