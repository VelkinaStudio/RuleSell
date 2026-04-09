"use client";

// Static lucide icon map. Importing icons by string name dynamically would
// recreate the component on every render and break React 19's static
// component rule, so we map the names we use to their concrete imports.
import {
  ArrowRightCircle,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  Box,
  Briefcase,
  Code2,
  Crown,
  Database,
  FileText,
  Flame,
  GitBranch,
  Github,
  type LucideIcon,
  Medal,
  MessageCircle,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Package,
  Puzzle,
  RefreshCw,
  Ruler,
  Server,
  ShieldCheck,
  ShieldHalf,
  Sparkle,
  Sparkles,
  Star,
  Tag,
  Terminal,
  TrendingUp,
  Users,
  Wind,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ArrowRightCircle,
  Award,
  BadgeCheck,
  Bot,
  BookOpen,
  Box,
  Briefcase,
  Code2,
  Crown,
  Database,
  FileText,
  Flame,
  GitBranch,
  Github,
  Medal,
  MessageCircle,
  MessageSquare,
  Monitor,
  MousePointerClick,
  Package,
  Puzzle,
  RefreshCw,
  Ruler,
  Server,
  ShieldCheck,
  ShieldHalf,
  Sparkle,
  Sparkles,
  Star,
  Tag,
  Terminal,
  TrendingUp,
  Users,
  Wind,
  Workflow,
  Wrench,
  Zap,
};

export function lookupLucideIcon(name: string): LucideIcon {
  return ICONS[name] ?? Tag;
}

interface IconByNameProps {
  name: string;
  className?: string;
}

/**
 * Render a lucide icon by string name. Uses a static lookup so React 19's
 * static-components rule is satisfied — the same `<IconByName>` component is
 * used at every call site, only the prop changes.
 */
export function IconByName({ name, className }: IconByNameProps) {
  const Comp = ICONS[name] ?? Tag;
  return <Comp className={className} />;
}
