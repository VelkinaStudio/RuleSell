import { Info } from "lucide-react";

export const metadata = {
  title: "About — RuleSell",
  description:
    "What RuleSell is, why it exists, how it works, and who built it.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-fg-muted" />
          <h1 className="text-2xl font-semibold text-fg">About RuleSell</h1>
        </div>
      </header>

      <div className="mt-10 space-y-12">
        <Section title="What it is">
          <p>
            A marketplace for AI development assets — MCP servers, skills,
            rules, workflows, agent teams, prompts, CLIs, datasets, and bundles.
            Both free open-source and paid premium.
          </p>
        </Section>

        <Section title="Why it exists">
          <p>
            The AI dev tool space is full of directories but empty of
            marketplaces. Creators earn zero on every major platform. Quality is
            unmeasured — the most popular items are often the worst performers on
            token efficiency and install success.
          </p>
          <p>We are fixing both.</p>
        </Section>

        <Section id="quality-score" title="How we are different">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <strong>Creators keep 85%</strong> of every sale. The platform
              takes 15%.
            </li>
            <li>
              <strong>Quality is measured, not voted on.</strong> Token
              efficiency, install success rate, schema cleanliness, freshness,
              and security scan results combine into a single quality score.
            </li>
            <li>
              <strong>Reviews come from verified installers only.</strong> You
              cannot review something you have not used.
            </li>
            <li>
              <strong>Items work across environments</strong> — Claude Code,
              Cursor, Windsurf, Cline, Zed, and more. One listing, multiple
              install variants.
            </li>
          </ul>
        </Section>

        <Section title="The team">
          <p>
            Built by{" "}
            <a
              href="https://github.com/VelkinaStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:underline"
            >
              Velkina Studio
            </a>
            . We use our own platform daily.
          </p>
        </Section>

        <Section title="Open source">
          <p>
            The frontend is open source.{" "}
            <a
              href="https://github.com/rulesell"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:underline"
            >
              Contributions welcome on GitHub.
            </a>
          </p>
        </Section>

        <Section title="Business model">
          <p>
            RuleSell takes a 15% commission on paid item sales. Free items are
            free for everyone — creators and users. There are no listing fees, no
            featured-placement taxes, and no hidden charges.
          </p>
          <p>
            We also offer a Pro subscription ($8/month) for power users who want
            private collections, full install history, and advanced filters. Pro
            is not required to buy or sell.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-fg-muted">
        {children}
      </div>
    </section>
  );
}
