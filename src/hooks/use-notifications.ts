"use client";

import { useCallback } from "react";
import type { Notification } from "@/types";

// In v1 mock mode, return mock notifications from constants
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";

export function useNotifications() {
  // TODO: Replace mock with real API when backend ships
  // const { data, error, isLoading, mutate } = useSWR(keys.notifications.all, () => notificationsApi.list());
  const data = MOCK_NOTIFICATIONS as Notification[];
  const isLoading = false;
  const error = null;

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const markRead = useCallback(async (id: string) => {
    // TODO: await notificationsApi.markRead(id); mutate();
  }, []);

  const markAllRead = useCallback(async () => {
    // TODO: await notificationsApi.markAllRead(); mutate();
  }, []);

  return { notifications: data ?? [], unreadCount, markRead, markAllRead, isLoading, error };
}
