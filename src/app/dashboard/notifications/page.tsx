import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications — Ruleset" };

const TYPE_LABELS: Record<string, string> = {
  NEW_FOLLOWER: "New Follower",
  NEW_REVIEW: "New Review",
  REVIEW_REPLY: "Review Reply",
  SALE_MADE: "Sale Made",
  RULESET_UPDATED: "Ruleset Updated",
  DISCUSSION_REPLY: "Discussion Reply",
  PAYOUT_COMPLETE: "Payout Complete",
  ADMIN_ANNOUNCEMENT: "Announcement",
};

export default async function DashboardNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Mark all as read
  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-8">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const data = n.data as Record<string, string>;
            return (
              <div
                key={n.id}
                className={`card p-4 ${!n.read ? "border-l-2 border-l-accent-green" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-accent-green uppercase tracking-wider">
                      {TYPE_LABELS[n.type] || n.type}
                    </span>
                    <p className="text-sm text-text-secondary mt-1">
                      {data.followerName && `${data.followerName} started following you`}
                      {data.reviewerName && `${data.reviewerName} reviewed "${data.rulesetTitle}"`}
                      {data.replierName && `${data.replierName} replied to "${data.discussionTitle}"`}
                      {!data.followerName && !data.reviewerName && !data.replierName && JSON.stringify(data)}
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card py-16 text-center text-text-tertiary">
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}
