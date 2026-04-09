"use client";

import { useCallback } from "react";
import useSWR from "swr";
import type { Notification } from "@/types";
import { notifications as notificationsApi } from "@/lib/api-client";
import { useSession } from "@/hooks/use-session";

export function useNotifications() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["notifications"] : null,
    () => notificationsApi.list(),
  );

  const markRead = useCallback(
    async (id: string) => {
      await notificationsApi.markRead([id]);
      mutate();
    },
    [mutate],
  );

  const markAllRead = useCallback(async () => {
    await notificationsApi.markRead();
    mutate();
  }, [mutate]);

  const notifications: Notification[] = (data?.notifications ?? []).map((n) => ({
    id: n.id,
    kind: n.type as Notification["kind"],
    title: n.title,
    body: n.body,
    href: "",
    read: n.read,
    createdAt: n.createdAt,
  }));

  return {
    notifications,
    unreadCount: data?.unreadCount ?? 0,
    markRead,
    markAllRead,
    isLoading,
    error: error as Error | null,
  };
}
