import { RulesetForm } from "@/components/rulesets/ruleset-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Ruleset — Ruleset" };

export default function NewRulesetPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Publish New Ruleset</h1>
      <RulesetForm />
    </div>
  );
}
