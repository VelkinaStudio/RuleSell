"use client";

import { Check, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  /** The username (or team slug) being followed. Used as the localStorage key. */
  target: string;
  scope?: "user" | "team" | "collection";
  className?: string;
}

const STORAGE_KEY = "rulesell:follows";

function readFollows(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function writeFollows(next: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function FollowButton({
  target,
  scope = "user",
  className,
}: FollowButtonProps) {
  const t = useTranslations(scope === "team" ? "team.actions" : "profile.actions");
  const key = `${scope}:${target}`;
  const [following, setFollowing] = useState(() => readFollows()[key] ?? false);
  const [hover, setHover] = useState(false);

  const onClick = () => {
    const next = !following;
    setFollowing(next);
    const all = readFollows();
    if (next) all[key] = true;
    else delete all[key];
    writeFollows(all);
  };

  const showUnfollowHover = following && hover;

  return (
    <Button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      variant={following ? "outline" : "default"}
      size="sm"
      className={cn(
        "gap-1.5 transition-all",
        following && !showUnfollowHover && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10",
        showUnfollowHover && "border-rose-500/40 bg-rose-500/10 text-rose-300",
        !following && "bg-brand text-brand-fg hover:brightness-110",
        className,
      )}
    >
      {following ? <Check className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
      <span>{following ? t("following") : t("follow")}</span>
    </Button>
  );
}
