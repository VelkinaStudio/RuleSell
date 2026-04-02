"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/rulesets/tag-input";
import { toast } from "@/components/ui/toast";

const PLATFORMS = ["CURSOR", "VSCODE", "OBSIDIAN", "N8N", "MAKE", "GEMINI", "CLAUDE", "CHATGPT", "OTHER"];
const TYPES = ["RULESET", "PROMPT", "WORKFLOW", "AGENT", "BUNDLE", "DATASET"];

interface RulesetFormProps {
  initial?: {
    id: string;
    title: string;
    description: string;
    previewContent: string;
    type: string;
    platform: string;
    category: string;
    price: number;
    status: string;
    tags: string[];
  };
}

export function RulesetForm({ initial }: RulesetFormProps) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [previewContent, setPreviewContent] = useState(initial?.previewContent || "");
  const [content, setContent] = useState("");
  const [type, setType] = useState(initial?.type || "RULESET");
  const [platform, setPlatform] = useState(initial?.platform || "CURSOR");
  const [category, setCategory] = useState(initial?.category || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "0");
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      title, description, previewContent, type, platform, category,
      price: parseFloat(price) || 0, tags,
      ...(isEdit ? { status } : { content }),
    };

    const res = await fetch(
      isEdit ? `/api/rulesets/${initial.id}` : "/api/rulesets",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toast(isEdit ? "Ruleset updated" : "Ruleset created", "success");
      router.push(`/r/${data.data.slug}`);
      router.refresh();
    } else {
      const err = await res.json();
      toast(err.error?.message || "Something went wrong", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Preview Content (public snippet)</label>
        <textarea
          value={previewContent}
          onChange={(e) => setPreviewContent(e.target.value)}
          rows={4}
          required
          placeholder="First ~10 lines shown publicly..."
          className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors font-mono"
        />
      </div>

      {!isEdit && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Full Content (v1.0.0)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Full ruleset content..."
            className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors font-mono"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., architecture, security" required />

      <Input label="Price (USD)" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />

      <TagInput value={tags} onChange={setTags} />

      {isEdit && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary focus:outline-none focus:border-accent-green transition-colors">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Ruleset" : "Create Ruleset"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
