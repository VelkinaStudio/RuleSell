import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, username } = body;

    if (!email || !password || !name || !username) {
      return errors.validation("All fields are required", {
        fields: ["email", "password", "name", "username"],
      });
    }

    if (password.length < 8) {
      return errors.validation("Password must be at least 8 characters");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return errors.validation(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );
    }

    if (username.length < 3 || username.length > 30) {
      return errors.validation("Username must be between 3 and 30 characters");
    }

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
