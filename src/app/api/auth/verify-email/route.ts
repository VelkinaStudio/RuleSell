import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return errors.validation("Verification token is required");
    }

    const user = await db.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return errors.notFound("Invalid or expired verification token");
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerifyToken: null,
      },
    });

    return success({ message: "Email verified successfully" });
  } catch {
    return errors.internal();
  }
}
