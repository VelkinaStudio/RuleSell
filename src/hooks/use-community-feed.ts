"use client";

import { useMemo } from "react";
import { MOCK_DISCUSSIONS } from "@/constants/mock-discussions";
import { MOCK_SHOWCASES } from "@/constants/mock-showcases";
import { MOCK_POLLS } from "@/constants/mock-polls";
import { MOCK_QA_QUESTIONS } from "@/constants/mock-qa";

export type FeedItemType = "discussion" | "showcase" | "poll" | "question";

export interface CommunityFeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  body: string;
  authorUsername: string;
  createdAt: string;
  meta: {
    replyCount?: number;
    reactionCount?: number;
    totalVotes?: number;
    answerCount?: number;
    voteCount?: number;
    tags?: string[];
  };
}

export function useCommunityFeed() {
  const items = useMemo<CommunityFeedItem[]>(() => {
    const feed: CommunityFeedItem[] = [
      ...MOCK_DISCUSSIONS.slice(0, 12).map((d) => ({
        id: `feed-disc-${d.id}`,
        type: "discussion" as const,
        title: d.title,
        body: d.body.slice(0, 120),
        authorUsername: d.author.username,
        createdAt: d.createdAt,
        meta: {
          replyCount: d.replyCount,
          reactionCount: d.reactionCount,
        },
      })),
      ...MOCK_SHOWCASES.map((s) => ({
        id: `feed-show-${s.id}`,
        type: "showcase" as const,
        title: s.title,
        body: s.description.slice(0, 120),
        authorUsername: s.author.username,
        createdAt: s.createdAt,
        meta: {
          reactionCount: s.reactionCount,
        },
      })),
      ...MOCK_POLLS.slice(0, 6).map((p) => ({
        id: `feed-poll-${p.id}`,
        type: "poll" as const,
        title: p.title,
        body: p.description.slice(0, 120),
        authorUsername: p.author.username,
        createdAt: p.createdAt,
        meta: {
          totalVotes: p.totalVotes,
        },
      })),
      ...MOCK_QA_QUESTIONS.slice(0, 8).map((q) => ({
        id: `feed-qa-${q.id}`,
        type: "question" as const,
        title: q.title,
        body: q.body.slice(0, 120),
        authorUsername: q.author.username,
        createdAt: q.createdAt,
        meta: {
          answerCount: q.answerCount,
          voteCount: q.voteCount,
          tags: q.tags,
        },
      })),
    ];

    return feed.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, []);

  return { items };
}
