import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/settings/profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile Settings — Ruleset" };

export default async function ProfileSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, email: true, bio: true },
  });

  if (!profile) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
