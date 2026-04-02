import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@ruleset.dev";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  if (!resend) {
    console.log(`[DEV] Verification email for ${email}: ${verifyUrl}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Verify your Ruleset account",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`[DEV] Password reset email for ${email}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Reset your Ruleset password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
