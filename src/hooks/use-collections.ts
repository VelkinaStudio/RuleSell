"use client";

import useSWR from "swr";

import type { Collection } from "@/types";
import { fetcher, type SWRKey } from "@/lib/api/fetcher";

export function useCollections() {
  const key: SWRKey = ["collections"] as const;
  return useSWR<Collection[]>(key, fetcher);
}

export function useCollection(slug: string | null) {
  const key: SWRKey | null = slug ? (["collection", slug] as const) : null;
  return useSWR<Collection>(key, fetcher);
}
