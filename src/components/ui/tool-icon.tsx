"use client";

import Image from "next/image";

import type { Environment } from "@/types";

const TOOL_SVG_MAP: Partial<Record<Environment, string>> = {
  "claude-code": "/icons/tools/claude-code.svg",
  "claude-desktop": "/icons/tools/claude-code.svg",
  cursor: "/icons/tools/cursor.svg",
  windsurf: "/icons/tools/windsurf.svg",
  cline: "/icons/tools/cline.svg",
  continue: "/icons/tools/continue.svg",
  zed: "/icons/tools/zed.svg",
  codex: "/icons/tools/codex.svg",
  chatgpt: "/icons/tools/chatgpt.svg",
  "gemini-cli": "/icons/tools/gemini-cli.svg",
  aider: "/icons/tools/aider.svg",
  copilot: "/icons/tools/copilot.svg",
  n8n: "/icons/tools/n8n.svg",
  make: "/icons/tools/make.svg",
  obsidian: "/icons/tools/obsidian.svg",
  custom: "/icons/tools/codex.svg",
};

interface ToolIconProps {
  environment: Environment;
  size?: number;
  className?: string;
}

export function ToolIcon({ environment, size = 20, className }: ToolIconProps) {
  const src = TOOL_SVG_MAP[environment];

  if (!src) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={environment}
      width={size}
      height={size}
      className={className}
      style={{ filter: "brightness(0) invert(0.85)" }}
      aria-hidden
    />
  );
}
