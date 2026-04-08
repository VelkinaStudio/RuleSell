"use client";

import { useCallback } from "react";
import useSWR from "swr";
import {
  notifications as notificationsApi,
  ApiError,
  type NotificationItem,
} from "@/lib/api-client";
import { keys } from "@/lib/query-keys";

export interface UseNotificationsResult {
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
  } | null;
  isLoading: boolean;
  error: ApiError | null;
  mutate: () => Promise<unknown>;
  /** Mark specific notifications as read. Omit `ids` to mark all as read. */
  markRead: (ids?: string[]) => Promise<void>;
}

/**
 * Fetch the current user's notifications and unread count, with a
 * convenience mark-read mutator that revalidates the list.
 */
export function useNotifications(): UseNotificationsResult {
  const { data, error, isLoading, mutate } = useSWR(
    keys.notifications.list,
    () => notificationsApi.list(),
    { refreshInterval: 30_000 },
  );

  const isAuthError = error instanceof ApiError && error.isUnauthorized;

  const markRead = useCallback(
    async (ids?: string[]) => {
      // Optimistic: locally zero the unread count for the target ids.
      if (data) {
        const targetIds = ids ?? data.notifications.filter((n) => !n.read).map((n) => n.id);
        const next = {
          notifications: data.notifications.map((n) =>
            targetIds.includes(n.id) ? { ...n, read: true } : n,
          ),
          unreadCount: Math.max(0, data.unreadCount - targetIds.length),
        };
        await mutate(notificationsApi.markRead(ids).then(() => next), {
          optimisticData: next,
          rollbackOnError: true,
          revalidate: true,
        });
      } else {
        await notificationsApi.markRead(ids);
        await mutate();
      }
    },
    [data, mutate],
  );

  return {
    data: isAuthError ? null : data ?? null,
    isLoading,
    error: error instanceof ApiError && !isAuthError ? error : null,
    mutate,
    markRead,
  };
}
