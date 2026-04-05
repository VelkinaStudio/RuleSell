import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { sendVerificationEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { email, password, name, username } = parsed.data;

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return errors.conflict("An account with this email already exists");
    }

    const existingUsername = await db.user.findUnique({ where: { username: username.toLowerCase() } });
    if (existingUsername) {
      return errors.conflict("This username is already taken");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        username: username.toLowerCase(),
        emailVerifyToken: verifyToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    await sendVerificationEmail(email, verifyToken);

    return success(user, 201);
  } catch {
    return errors.internal();
  }
}
