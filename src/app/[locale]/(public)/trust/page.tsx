import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "How Trust Works — RuleSell",
  description:
    "Quality scores, badges, creator marks, reviews, security scanning, and reputation levels on RuleSell.",
};

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-fg-muted" />
          <h1 className="text-2xl font-semibold text-fg">
            How trust works on RuleSell
          </h1>
        </div>
        <p className="text-sm text-fg-muted">
          Every signal on the marketplace is earned, not bought. This page
          explains what each badge, score, and mark means and how to get one.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {/* Quality Score */}
        <Section title="Quality Score">
          <p>
            We measure token efficiency, install success rate, schema
            cleanliness, freshness, and security scan results. The quality score
            is a single number (0–100) that summarizes these signals. It is the
            default sort on the marketplace — not stars, not downloads.
          </p>
          <p>
            Stars can be gamed. Quality can&apos;t — at least not without
            actually shipping better code.
          </p>
          <p className="text-fg-dim text-xs">
            Quality scores are currently estimated from automated signals. They
            are not perfect, and we are working to improve them.
          </p>
        </Section>

        {/* Item Badges */}
        <Section title="Item badges">
          <p className="mb-3">
            Badges appear on cards and detail pages. They stack — an item can
            carry several at once.
          </p>
          <dl className="space-y-4">
            <BadgeDef
              name="Verified"
              description="Staff review + malware scan + install test. Required for all paid items."
              earn="Submit your item for review. We test it in a sandboxed environment."
            />
            <BadgeDef
              name="Maintainer Verified"
              description="The listing is claimed by the original open-source author via GitHub OAuth."
              earn="Connect your GitHub account and prove you own the linked repo."
            />
            <BadgeDef
              name="Editor's Pick"
              description="Monthly staff curation. We pick items that are genuinely useful, not just popular."
              earn="Ship something good. We notice."
            />
            <BadgeDef
              name="Popular"
              description="500+ verified installs in the last 30 days."
              earn="Get people to actually use your item."
            />
            <BadgeDef
              name="Updated"
              description="Last update within 90 days."
              earn="Push an update."
            />
            <BadgeDef
              name="New"
              description="Created within the last 14 days."
              earn="Publish something."
            />
            <BadgeDef
              name="Official"
              description="First-party RuleSell item."
              earn="Built by the RuleSell team."
            />
            <BadgeDef
              name="Featured"
              description="Paid placement. Always labeled as sponsored."
              earn="Contact us about featured placements. We clearly label every one."
            />
            <BadgeDef
              name="Quality A / B / C"
              description="Derived from the quality score. A = 85+, B = 70–84, C = 50–69."
              earn="Improve your item's token efficiency, install success rate, and freshness."
            />
          </dl>
        </Section>

        {/* Creator Marks */}
        <Section title="Creator marks">
          <p className="mb-3">
            Marks appear on creator avatars and profile pages. They signal who
            someone is and how they earned their status.
          </p>
          <dl className="space-y-4">
            <BadgeDef
              name="Verified Creator"
              description="The creator has confirmed their email, domain, and enabled 2FA."
              earn="Verify your email and turn on two-factor authentication."
            />
            <BadgeDef
              name="Trader"
              description="DSA Art. 30 KYC complete. Required for anyone selling paid items."
              earn="Complete the trader verification process in Settings > Seller."
            />
            <BadgeDef
              name="Certified Dev"
              description="Earned reviewer status. Can write verified-install reviews."
              earn="Reach 200 reputation, get peer-vouched by 3 Certified Devs, or get staff approval."
            />
            <BadgeDef
              name="Pro"
              description="Active Pro subscription ($8/month)."
              earn="Subscribe to Pro."
            />
            <BadgeDef
              name="Team"
              description="Member of a verified team."
              earn="Create or join a team."
            />
            <BadgeDef
              name="Maintainer"
              description="Owns at least one verified GitHub project listed on RuleSell."
              earn="Claim a listing linked to a repo you own."
            />
            <BadgeDef
              name="Top Rated"
              description="4.5+ average rating across 20+ items."
              earn="Ship consistently well-reviewed items."
            />
          </dl>
        </Section>

        {/* Reviews */}
        <Section title="Reviews">
          <p>
            Reviews on RuleSell come only from people who actually installed the
            item. We call this &ldquo;verified install&rdquo; — you cannot
            review something you have not used.
          </p>
          <p>
            Written reviews are further restricted to Certified Devs. Star
            ratings are open to anyone with a verified install.
          </p>
        </Section>

        {/* Security Scanning */}
        <Section title="Security scanning">
          <p>
            Every item is scanned for known malware patterns before it is
            listed. We use VirusTotal for hash-based detection, Semgrep for
            static analysis, and a sandboxed install test for runtime behavior.
          </p>
          <p>
            Paid items go through an additional manual review before approval.
          </p>
        </Section>

        {/* Reputation Levels */}
        <Section title="Reputation levels">
          <p className="mb-3">
            Reputation is earned by contributing to the marketplace. Every
            verified install, review, and community action adds points.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border-soft">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-soft bg-bg-raised text-xs text-fg-subtle">
                <tr>
                  <th className="px-4 py-2 font-medium">Level</th>
                  <th className="px-4 py-2 font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft text-fg-muted">
                <tr><td className="px-4 py-2">Newcomer</td><td className="px-4 py-2 font-mono">0</td></tr>
                <tr><td className="px-4 py-2">Member</td><td className="px-4 py-2 font-mono">10</td></tr>
                <tr><td className="px-4 py-2">Contributor</td><td className="px-4 py-2 font-mono">50</td></tr>
                <tr><td className="px-4 py-2">Trusted</td><td className="px-4 py-2 font-mono">100</td></tr>
                <tr><td className="px-4 py-2">Expert</td><td className="px-4 py-2 font-mono">300</td></tr>
                <tr><td className="px-4 py-2">Authority</td><td className="px-4 py-2 font-mono">500</td></tr>
              </tbody>
            </table>
          </div>
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

function BadgeDef({
  name,
  description,
  earn,
}: {
  name: string;
  description: string;
  earn: string;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-bg-surface p-3">
      <dt className="text-sm font-medium text-fg">{name}</dt>
      <dd className="mt-1 text-sm text-fg-muted">{description}</dd>
      <dd className="mt-1 text-xs text-fg-subtle">
        <span className="font-medium">How to earn:</span> {earn}
      </dd>
    </div>
  );
}
