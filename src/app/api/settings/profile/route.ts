import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { rateLimitWrite } from "@/lib/rate-limit";
import { updateProfileSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, username: true, email: true, bio: true, avatar: true },
    });

    return success(user);
  } catch {
    return errors.internal();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rl = await rateLimitWrite(`settings:${session.user.id}`);
    if (!rl.ok) return errors.rateLimited();

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }

    const { name, username, bio } = parsed.data;

    // Check username uniqueness if changing
    if (username && username.toLowerCase() !== session.user.username) {
      const existing = await db.user.findUnique({
        where: { username: username.toLowerCase() },
      });
      if (existing) return errors.conflict("Username is already taken");
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username: username.toLowerCase() }),
        ...(bio !== undefined && { bio }),
      },
      select: { id: true, name: true, username: true, bio: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}
