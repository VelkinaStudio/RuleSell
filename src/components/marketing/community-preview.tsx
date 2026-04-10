"use client";

import { MessageSquare, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { Link } from "@/i18n/navigation";
import { sectionReveal, sectionChild } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface CommunityPreviewProps {
  className?: string;
}

type ActivityKind = "discussion" | "showcase";

interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  createdAt: string;
}

function buildFeed(): ActivityItem[] {
  const discussions: ActivityItem[] = MOCK_DISCUSSIONS.map((d) => ({
    id: d.id,
    kind: "discussion",
    title: d.title,
    description: d.body,
    createdAt: d.createdAt,
  }));

  const showcases: ActivityItem[] = MOCK_SHOWCASES.map((s) => ({
    id: s.id,
    kind: "showcase",
    title: s.title,
    description: s.description,
    createdAt: s.createdAt,
  }));

  return [...discussions, ...showcases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const FEED = buildFeed();

export function CommunityPreview({ className }: CommunityPreviewProps) {
  const t = useTranslations("landing.communityPreview");
  const reduce = useReducedMotion();

  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {t("title")}
        </h2>

        <motion.ul
          className="mt-10 divide-y divide-border"
          variants={sectionReveal}
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          aria-label={t("title")}
        >
          {FEED.length === 0 ? (
            <li className="py-8 text-center text-sm text-fg-muted">
              {t("emptyState")}
            </li>
          ) : (
            FEED.map((item) => {
              const Icon = item.kind === "discussion" ? MessageSquare : Sparkles;
              const iconClass =
                item.kind === "discussion"
                  ? "text-brand"
                  : "text-yellow-400";

              return (
                <motion.li
                  key={item.id}
                  variants={sectionChild}
                  className="flex gap-3 py-4"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-raised",
                      iconClass,
                    )}
                    aria-hidden
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">
                      {item.description}
                    </p>
                  </div>

                  <time
                    dateTime={item.createdAt}
                    className="ml-2 shrink-0 text-xs text-fg-subtle"
                  >
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </motion.li>
              );
            })
          )}
        </motion.ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center rounded-lg border border-border bg-bg-raised px-5 py-2.5 text-sm font-medium text-fg transition hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
