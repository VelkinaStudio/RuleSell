"use client";

import { useCallback, useState } from "react";
import type { Poll } from "@/types";
import { MOCK_POLLS } from "@/constants/mock-polls";

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
  const [votedOptions, setVotedOptions] = useState<Record<string, string>>({});

  const vote = useCallback((pollId: string, optionId: string) => {
    const prev = votedOptions[pollId];
    if (prev === optionId) {
      // Un-vote
      setVotedOptions((v) => {
        const next = { ...v };
        delete next[pollId];
        return next;
      });
      setPolls((ps) =>
        ps.map((p) =>
          p.id === pollId
            ? {
                ...p,
                totalVotes: p.totalVotes - 1,
                options: p.options.map((o) =>
                  o.id === optionId
                    ? { ...o, voteCount: o.voteCount - 1 }
                    : o,
                ),
              }
            : p,
        ),
      );
    } else {
      // Vote (or switch vote)
      setVotedOptions((v) => ({ ...v, [pollId]: optionId }));
      setPolls((ps) =>
        ps.map((p) =>
          p.id === pollId
            ? {
                ...p,
                totalVotes: prev ? p.totalVotes : p.totalVotes + 1,
                options: p.options.map((o) => {
                  if (o.id === optionId) return { ...o, voteCount: o.voteCount + 1 };
                  if (o.id === prev) return { ...o, voteCount: o.voteCount - 1 };
                  return o;
                }),
              }
            : p,
        ),
      );
    }
  }, [votedOptions]);

  const activePolls = polls.filter((p) => p.isActive);
  const expiredPolls = polls.filter((p) => !p.isActive);

  return { polls, activePolls, expiredPolls, vote, votedOptions };
}
