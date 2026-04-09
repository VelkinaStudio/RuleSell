import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, newPassword } = body;

    // Step 1: Request password reset (email only)
    if (email && !token) {
      // Rate limit: 3 reset requests per hour per email
      const rl = rateLimit(`reset:${(email as string).toLowerCase()}`, 3, 60 * 60 * 1000);
      if (!rl.ok) return errors.rateLimited();
      const user = await db.user.findUnique({ where: { email } });

      // Always return success to prevent email enumeration
      if (!user) {
        return success({ message: "If an account exists, a reset email has been sent" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: expires,
        },
      });

      await sendPasswordResetEmail(email, resetToken);

      return success({ message: "If an account exists, a reset email has been sent" });
    }

    // Step 2: Reset password with token
    if (token && newPassword) {
      if (newPassword.length < 8) {
        return errors.validation("Password must be at least 8 characters");
      }

      const user = await db.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { gt: new Date() },
        },
      });

      if (!user) {
        return errors.notFound("Invalid or expired reset token");
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });

      return success({ message: "Password reset successfully" });
    }

    return errors.validation("Provide email to request reset, or token + newPassword to complete reset");
  } catch {
    return errors.internal();
  }
}
