import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notification Preferences — Ruleset" };

const NOTIFICATION_TYPES = [
  { type: "NEW_FOLLOWER", label: "New Follower", description: "When someone follows you" },
  { type: "NEW_REVIEW", label: "New Review", description: "When someone reviews your ruleset" },
  { type: "REVIEW_REPLY", label: "Review Reply", description: "When an author replies to your review" },
  { type: "SALE_MADE", label: "Sale Made", description: "When someone purchases your ruleset" },
  { type: "RULESET_UPDATED", label: "Ruleset Updated", description: "When a ruleset you own gets updated" },
  { type: "DISCUSSION_REPLY", label: "Discussion Reply", description: "When someone replies to your discussion" },
  { type: "PAYOUT_COMPLETE", label: "Payout Complete", description: "When a payout is processed" },
];

export default async function NotificationPreferencesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const prefs = await db.notificationPreference.findMany({
    where: { userId: session.user.id },
  });


  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-4">Notification Preferences</h2>
      <p className="text-sm text-text-tertiary mb-6">Choose which notifications you want to receive.</p>

      <div className="space-y-4">
        {NOTIFICATION_TYPES.map((nt) => {
          const pref = prefs.find((p) => p.type === nt.type);
          return (
            <div key={nt.type} className="card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">{nt.label}</p>
                <p className="text-xs text-text-tertiary">{nt.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                <span>In-app: {!pref || pref.inAppEnabled ? "On" : "Off"}</span>
                <span>Email: {!pref || pref.emailEnabled ? "On" : "Off"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
