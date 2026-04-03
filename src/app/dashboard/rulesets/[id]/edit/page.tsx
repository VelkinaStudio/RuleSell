import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RulesetForm } from "@/components/rulesets/ruleset-form";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Ruleset — Ruleset" };

export default async function EditRulesetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const ruleset = await db.ruleset.findUnique({
    where: { id },
    include: { tags: { select: { tag: { select: { name: true } } } } },
  });

  if (!ruleset) notFound();
  if (ruleset.authorId !== session.user.id) redirect("/dashboard/rulesets");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Edit Ruleset</h1>
      <RulesetForm
        initial={{
          id: ruleset.id,
          title: ruleset.title,
          description: ruleset.description,
          previewContent: ruleset.previewContent,
          type: ruleset.type,
          platform: ruleset.platform,
          category: ruleset.category,
          price: ruleset.price,
          status: ruleset.status,
          tags: ruleset.tags.map((t) => t.tag.name),
        }}
      />
    </div>
  );
}
