"use client";

import { useCallback, useMemo, useState } from "react";
import type { Role, User } from "@/types";
import { ADMIN_USERS } from "@/constants/mock-admin";

interface UseAdminUsersOptions {
  search?: string;
  roleFilter?: Role | "ALL";
  page?: number;
  pageSize?: number;
}

export function useAdminUsers({
  search = "",
  roleFilter = "ALL",
  page = 1,
  pageSize = 10,
}: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>(ADMIN_USERS);

  const filtered = useMemo(() => {
    let result = users;
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    return result;
  }, [users, roleFilter, search]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const changeRole = useCallback((userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  }, []);

  const suspendUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId && u.sellerStats
          ? {
              ...u,
              sellerStats: {
                ...u.sellerStats,
                traderVerified: false,
                paymentConnectStatus: "none" as const,
              },
            }
          : u,
      ),
    );
  }, []);

  return {
    users: paginated,
    total,
    totalPages,
    changeRole,
    suspendUser,
    isLoading: false,
  };
}
