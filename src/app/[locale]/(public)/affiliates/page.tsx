import { Share2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Earn by Sharing — RuleSell Affiliate Program",
  description:
    "Share your referral link. If someone makes a purchase through it within 30 days, you earn a commission.",
};

export default function AffiliatesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-fg-muted" />
          <h1 className="text-2xl font-semibold text-fg">Earn by sharing</h1>
        </div>
        <p className="text-sm text-fg-muted">
          Share your referral link. If someone makes a purchase through it
          within 30 days, you earn a commission. No approval needed.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        <Section title="How it works">
          <ol className="list-inside list-decimal space-y-1.5">
            <li>Sign in to RuleSell. Your referral link is ready immediately.</li>
            <li>
              Share the link — in a newsletter, a YouTube description, a tweet,
              a blog post, wherever.
            </li>
            <li>
              When someone clicks your link and makes a purchase within 30 days,
              you earn a commission.
            </li>
            <li>
              Commissions accumulate in your dashboard. Payouts happen monthly
              once you reach $50.
            </li>
          </ol>
        </Section>

        <Section title="Commission rates">
          <div className="overflow-x-auto rounded-lg border border-border-soft">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-soft bg-bg-raised text-xs text-fg-subtle">
                <tr>
                  <th className="px-4 py-2 font-medium">Scenario</th>
                  <th className="px-4 py-2 font-medium">Rate</th>
                  <th className="px-4 py-2 font-medium">Who pays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft text-fg-muted">
                <tr>
                  <td className="px-4 py-2">Creator-enabled affiliate (default)</td>
                  <td className="px-4 py-2 font-mono">10%</td>
                  <td className="px-4 py-2">Creator (from their 85% share)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Creator-enabled affiliate (custom)</td>
                  <td className="px-4 py-2 font-mono">5–30%</td>
                  <td className="px-4 py-2">Creator (from their 85% share)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Platform referral (any first purchase)</td>
                  <td className="px-4 py-2 font-mono">5%</td>
                  <td className="px-4 py-2">Platform (from 15% cut)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Free item referral</td>
                  <td className="px-4 py-2 font-mono">$0</td>
                  <td className="px-4 py-2">Tracked, no payout</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Example:</strong> $19 item with default 10% affiliate rate.
            Platform takes $2.85 (15%). Affiliate earns $1.62 (10% of the
            creator&apos;s $16.15 share). Creator keeps $14.54.
          </p>
        </Section>

        <Section title="Your link">
          <p>Every item on RuleSell has a shareable affiliate URL:</p>
          <div className="rounded-lg border border-border-soft bg-bg-raised px-4 py-3 font-mono text-xs text-fg-muted">
            rulesell.dev/r/[item-slug]?ref=[your-username]
          </div>
          <p>
            You can also copy your general referral link from the{" "}
            <Link
              href="/dashboard/affiliates"
              className="text-fg hover:underline"
            >
              affiliate dashboard
            </Link>
            .
          </p>
        </Section>

        <Section title="Cookie window">
          <p>
            30 days. If someone clicks your link today and buys next week, you
            still get credit. If they click another affiliate&apos;s link later,
            the most recent click wins (last-click attribution).
          </p>
        </Section>

        <Section title="Payouts">
          <p>
            $50 minimum, monthly, via Stripe Connect. Same system as creator
            payouts. Earnings show in your dashboard alongside any creator
            earnings.
          </p>
          <p>
            There is a 30-day hold on all commissions to account for refunds and
            chargebacks.
          </p>
        </Section>

        <Section title="Who it is for">
          <p>
            YouTubers, newsletter authors, Twitter devs, anyone who recommends
            tools to other developers. If you are already recommending MCP
            servers and skills, you might as well get paid for it.
          </p>
          <p>
            Self-referral is allowed — if you are a creator promoting your own
            items, you earn both the creator revenue and the affiliate bonus.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-fg-muted">
        {children}
      </div>
    </section>
  );
}
