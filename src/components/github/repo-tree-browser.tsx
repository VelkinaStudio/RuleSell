"use client";

import { useState } from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import type { GitHubTreeEntry } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface RepoTreeBrowserProps {
  entries: GitHubTreeEntry[];
  selectedPaths: string[];
  onSelectionChange: (paths: string[]) => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/** Build a nested tree from flat paths */
interface TreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  size: number;
  children: TreeNode[];
}

function buildTree(entries: GitHubTreeEntry[]): TreeNode[] {
  const dirs: TreeNode[] = [];
  const files: TreeNode[] = [];

  for (const entry of entries) {
    if (entry.type === "dir") {
      dirs.push({
        name: entry.path.replace(/\/$/, ""),
        path: entry.path,
        type: "dir",
        size: 0,
        children: [],
      });
    } else {
      const parts = entry.path.split("/");
      if (parts.length > 1) {
        // File inside a directory
        const dirPath = parts[0] + "/";
        const dir = dirs.find((d) => d.path === dirPath);
        if (dir) {
          dir.children.push({
            name: parts.slice(1).join("/"),
            path: entry.path,
            type: "file",
            size: entry.size,
            children: [],
          });
          continue;
        }
      }
      files.push({
        name: parts[parts.length - 1],
        path: entry.path,
        type: "file",
        size: entry.size,
        children: [],
      });
    }
  }

  return [...dirs, ...files];
}

export function RepoTreeBrowser({
  entries,
  selectedPaths,
  onSelectionChange,
  className,
}: RepoTreeBrowserProps) {
  const t = useTranslations("github.treeBrowser");
  const tree = buildTree(entries);

  const togglePath = (path: string) => {
    if (selectedPaths.includes(path)) {
      onSelectionChange(selectedPaths.filter((p) => p !== path));
    } else {
      onSelectionChange([...selectedPaths, path]);
    }
  };

  const selectAll = () => {
    const allFiles = entries.filter((e) => e.type === "file").map((e) => e.path);
    onSelectionChange(allFiles);
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const fileCount = entries.filter((e) => e.type === "file").length;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-fg-muted">
          {t("filesSelected", {
            selected: selectedPaths.length,
            total: fileCount,
          })}
        </p>
        <div className="flex gap-2 text-[11px]">
          <button
            type="button"
            onClick={selectAll}
            className="text-brand transition hover:text-brand/80"
          >
            {t("selectAll")}
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="text-fg-subtle transition hover:text-fg"
          >
            {t("deselectAll")}
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border-soft bg-bg-raised/40 py-1">
        {tree.map((node) => (
          <TreeRow
            key={node.path}
            node={node}
            depth={0}
            selectedPaths={selectedPaths}
            onToggle={togglePath}
          />
        ))}
      </div>
    </div>
  );
}

function TreeRow({
  node,
  depth,
  selectedPaths,
  onToggle,
}: {
  node: TreeNode;
  depth: number;
  selectedPaths: string[];
  onToggle: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isDir = node.type === "dir";
  const isSelected = selectedPaths.includes(node.path);

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm",
          isDir
            ? "cursor-pointer hover:bg-bg-surface/60"
            : "hover:bg-bg-surface/40",
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {isDir ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-fg-muted transition hover:text-fg"
          >
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                expanded && "rotate-90",
              )}
            />
            {expanded ? (
              <FolderOpen className="h-4 w-4 text-amber-400" />
            ) : (
              <Folder className="h-4 w-4 text-amber-400" />
            )}
            <span className="text-xs font-medium text-fg">{node.name}</span>
          </button>
        ) : (
          <>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggle(node.path)}
              className="h-3.5 w-3.5"
            />
            <File className="h-3.5 w-3.5 text-fg-subtle" />
            <span className="flex-1 truncate text-xs text-fg-muted">
              {node.name}
            </span>
            <span className="text-[10px] tabular-nums text-fg-dim">
              {formatFileSize(node.size)}
            </span>
          </>
        )}
      </div>

      {isDir &&
        expanded &&
        node.children.map((child) => (
          <TreeRow
            key={child.path}
            node={child}
            depth={depth + 1}
            selectedPaths={selectedPaths}
            onToggle={onToggle}
          />
        ))}
    </>
  );
}
