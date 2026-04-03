import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing — Ruleset" };

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isPro = session.user.role === "PRO";

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-4">Billing & Subscription</h2>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-text-secondary">Current plan:</span>
          <Badge variant={isPro ? "green" : "default"}>
            {isPro ? "Pro" : "Free"}
          </Badge>
        </div>

        {isPro ? (
          <div>
            <p className="text-sm text-text-secondary mb-4">
              You have access to full analytics, lower platform commission rates, and all Pro features.
            </p>
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-text-secondary mb-4">
              Upgrade to Pro for full analytics dashboard, lower commission rates, and more.
            </p>
            <ul className="text-sm text-text-tertiary space-y-1 mb-4">
              <li>&#10003; Full analytics dashboard (views, conversions, revenue trends)</li>
              <li>&#10003; Lower platform commission rate</li>
              <li>&#10003; Audience breakdown & insights</li>
            </ul>
            <Button size="sm">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
