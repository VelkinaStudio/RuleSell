"use client";

import { SWRConfig } from "swr";

import { fetcher } from "@/lib/api/fetcher";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // SWR's typing wants a generic key, but our fetcher narrows on the
        // tuple shape itself.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetcher: fetcher as any,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
