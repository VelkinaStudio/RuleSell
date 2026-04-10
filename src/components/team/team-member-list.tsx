"use client";

import { useTranslations } from "next-intl";

import type { Team } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-brand/15 text-brand border-brand/30",
  admin: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  member: "bg-bg-raised text-fg-subtle border-border-soft",
};

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
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
        {t("membersTitle")}
      </h2>
      {/* Horizontal scrollable strip */}
      <div className="flex items-start gap-3 overflow-x-auto pb-1 scrollbar-none">
        <TooltipProvider delayDuration={200}>
          {visible.map((member) => {
            const roleStyle = ROLE_STYLES[member.role] ?? ROLE_STYLES.member;
            return (
              <Tooltip key={member.username}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/u/${member.username}`}
                    className="group flex shrink-0 flex-col items-center gap-2"
                  >
                    <div className="relative">
                      <Avatar
                        size="default"
                        className="ring-2 ring-border-soft transition group-hover:ring-brand/50"
                      >
                        <AvatarFallback className="text-sm font-semibold">
                          {member.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                        <AvatarImage alt={member.username} />
                      </Avatar>
                      {/* Role badge */}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider",
                          roleStyle,
                        )}
                      >
                        {member.role}
                      </span>
                    </div>
                    <span className="mt-1 text-xs font-medium text-fg-muted transition group-hover:text-fg">
                      @{member.username}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">@{member.username}</p>
                  <p className="text-xs text-fg-muted capitalize">{member.role}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
        {overflow > 0 && (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-border-soft bg-bg-surface text-xs font-semibold text-fg-muted">
              +{overflow}
            </div>
            <span className="text-xs text-fg-subtle">more</span>
          </div>
        )}
      </div>
    </section>
  );
}
