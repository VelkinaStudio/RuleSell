"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface DownloadButtonProps {
  rulesetId: string;
  versionId?: string;
  hasFiles: boolean;
}

export function DownloadButton({ rulesetId, versionId, hasFiles }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!hasFiles) return null;

  async function handleDownload() {
    setLoading(true);
    try {
      const params = versionId ? `?versionId=${versionId}` : "";
      window.location.href = `/api/downloads/${rulesetId}${params}`;
    } catch {
      toast("Download failed", "error");
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleDownload} disabled={loading} variant="secondary" size="sm">
      {loading ? "Preparing..." : "Download"}
    </Button>
  );
}
