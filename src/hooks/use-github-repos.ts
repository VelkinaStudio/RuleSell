"use client";

import { useMemo, useState } from "react";

import type { GitHubRepo, GitHubTreeEntry } from "@/types";
import {
  MOCK_GITHUB_REPOS,
  MOCK_FILE_TREES,
  CLAIMED_REPOS,
} from "@/constants/mock-github";

interface UseGitHubReposOptions {
  query?: string;
  languageFilter?: string | null;
  showPrivate?: boolean;
  page?: number;
  pageSize?: number;
}

interface UseGitHubReposReturn {
  repos: GitHubRepo[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  setPage: (p: number) => void;
  getTree: (repoFullName: string) => GitHubTreeEntry[];
  isClaimed: (repoFullName: string) => boolean;
  claimedRulesetId: (repoFullName: string) => string | null;
}

export function useGitHubRepos(
  options: UseGitHubReposOptions = {},
): UseGitHubReposReturn {
  const {
    query = "",
    languageFilter = null,
    showPrivate = true,
    page: initialPage = 1,
    pageSize = 8,
  } = options;

  const [page, setPage] = useState(initialPage);

  const filtered = useMemo(() => {
    let repos = MOCK_GITHUB_REPOS;

    if (!showPrivate) {
      repos = repos.filter((r) => !r.isPrivate);
    }

    if (languageFilter) {
      repos = repos.filter(
        (r) =>
          r.language?.toLowerCase() === languageFilter.toLowerCase(),
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      repos = repos.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.org?.name.toLowerCase().includes(q) ?? false),
      );
    }

    return repos;
  }, [query, languageFilter, showPrivate]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const repos = filtered.slice(start, start + pageSize);

  const getTree = (repoFullName: string): GitHubTreeEntry[] =>
    MOCK_FILE_TREES[repoFullName] ?? [];

  const isClaimed = (repoFullName: string): boolean =>
    repoFullName in CLAIMED_REPOS;

  const claimedRulesetId = (repoFullName: string): string | null =>
    CLAIMED_REPOS[repoFullName] ?? null;

  return {
    repos,
    total,
    page: safePage,
    pageSize,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    isLoading: false,
    setPage,
    getTree,
    isClaimed,
    claimedRulesetId,
  };
}
