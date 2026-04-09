"use client";

import { useTranslations } from "next-intl";

import type { Team } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";

interface TeamMemberListProps {
  team: Team;
  /** Max members shown inline before "+N more" overflow chip. */
  inlineLimit?: number;
}

export function TeamMemberList({ team, inlineLimit = 10 }: TeamMemberListProps) {
  const t = useTranslations("team");
  const visible = team.members.slice(0, inlineLimit);
  const overflow = team.members.length - visible.length;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        {t("membersTitle")}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        {visible.map((member) => (
          <Link
            key={member.username}
            href={`/u/${member.username}`}
            className="group flex items-center gap-2 rounded-full border border-border-soft bg-bg-surface px-2 py-1 pr-3 transition hover:border-brand/40 hover:bg-bg-elevated"
          >
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {member.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
              <AvatarImage alt={member.username} />
            </Avatar>
            <span className="text-xs font-medium text-fg-muted group-hover:text-fg">
              @{member.username}
            </span>
            {member.role !== "member" && (
              <span className="rounded-full bg-bg-raised px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-fg-subtle">
                {member.role}
              </span>
            )}
          </Link>
        ))}
        {overflow > 0 && (
          <span className="rounded-full border border-dashed border-border-soft px-3 py-1 text-xs font-medium text-fg-muted">
            +{overflow}
          </span>
        )}
      </div>
    </section>
  );
}
