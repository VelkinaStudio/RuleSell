import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BundleForm } from "./bundle-form";

export const metadata: Metadata = { title: "Create Bundle — Ruleset" };

export default async function NewBundlePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rulesets = await db.ruleset.findMany({
    where: { authorId: session.user.id, status: { in: ["PUBLISHED", "DRAFT"] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, price: true, status: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Create Bundle</h1>
      <BundleForm rulesets={rulesets} />
    </div>
  );
}
