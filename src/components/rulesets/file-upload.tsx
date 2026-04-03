"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FileUploadProps {
  rulesetId: string;
  versionId: string;
  onUploadComplete?: (fileBundle: { id: string; filename: string; sizeBytes: number }) => void;
}

const FORMAT_MAP: Record<string, string> = {
  ".cursorrules": "CURSORRULES",
  ".md": "MARKDOWN",
  ".json": "JSON",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".txt": "TEXT",
  ".zip": "ZIP",
  ".toml": "TOML",
  ".js": "JAVASCRIPT",
  ".py": "PYTHON",
};

export function FileUpload({ rulesetId, versionId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Get presigned URL
      setProgress("Getting upload URL...");
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rulesetId,
          versionId,
          filename: file.name,
          sizeBytes: file.size,
        }),
      });

      if (!presignRes.ok) {
        const err = await presignRes.json();
        toast(err.error?.message || "Failed to prepare upload", "error");
        setUploading(false);
        return;
      }

      const { data: presignData } = await presignRes.json();

      // Step 2: Upload directly to R2
      setProgress("Uploading file...");
      const uploadRes = await fetch(presignData.url, {
        method: "PUT",
        headers: { "Content-Type": presignData.mimeType },
        body: file,
      });

      if (!uploadRes.ok) {
        toast("File upload failed", "error");
        setUploading(false);
        return;
      }

      // Step 3: Confirm upload
      setProgress("Confirming...");
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      const format = FORMAT_MAP[ext] || "TEXT";

      const confirmRes = await fetch("/api/uploads/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rulesetId,
          versionId,
          storageKey: presignData.storageKey,
          filename: file.name,
          format,
        }),
      });

      if (confirmRes.ok) {
        const { data: fileBundle } = await confirmRes.json();
        toast("File uploaded successfully", "success");
        onUploadComplete?.(fileBundle);
      } else {
        const err = await confirmRes.json();
        toast(err.error?.message || "Upload confirmation failed", "error");
      }
    } catch {
      toast("Upload failed", "error");
    }

    setUploading(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".cursorrules,.md,.json,.yaml,.yml,.txt,.zip,.toml,.js,.py"
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? progress : "Upload File"}
      </Button>
      <p className="text-xs text-text-tertiary">
        Supported: .cursorrules, .md, .json, .yaml, .txt, .zip, .toml, .js, .py (max 50MB)
      </p>
    </div>
  );
}
