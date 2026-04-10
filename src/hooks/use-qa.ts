"use client";

import { useMemo, useState } from "react";
import type { QAQuestion, QAAnswer } from "@/types";
import { MOCK_QA_QUESTIONS, MOCK_QA_ANSWERS } from "@/constants/mock-qa";

export type QAFilter = "all" | "answered" | "unanswered";

export function useQA() {
  const [filter, setFilter] = useState<QAFilter>("all");
  const [votes, setVotes] = useState<Record<string, number>>({});

  const questions = useMemo(() => {
    let q: QAQuestion[] = MOCK_QA_QUESTIONS;
    if (filter === "answered") q = q.filter((x) => x.acceptedAnswerId !== null);
    if (filter === "unanswered") q = q.filter((x) => x.acceptedAnswerId === null);
    return q.map((question) => ({
      ...question,
      voteCount: question.voteCount + (votes[question.id] ?? 0),
    }));
  }, [filter, votes]);

  const answersForQuestion = (questionId: string): QAAnswer[] =>
    MOCK_QA_ANSWERS.filter((a) => a.questionId === questionId).map((a) => ({
      ...a,
      voteCount: a.voteCount + (votes[a.id] ?? 0),
    }));

  const voteOnItem = (itemId: string, direction: "up" | "down") => {
    setVotes((prev) => {
      const current = prev[itemId] ?? 0;
      const delta = direction === "up" ? 1 : -1;
      // Toggle: if already voted in this direction, undo
      if (current === delta) return { ...prev, [itemId]: 0 };
      return { ...prev, [itemId]: delta };
    });
  };

  const getUserVote = (itemId: string): number => votes[itemId] ?? 0;

  return { questions, filter, setFilter, answersForQuestion, voteOnItem, getUserVote };
}
