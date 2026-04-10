"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin/overview");
  }, [router]);

  return null;
}
