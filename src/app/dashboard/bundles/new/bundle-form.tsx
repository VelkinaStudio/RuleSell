"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Ruleset {
  id: string;
  title: string;
  price: number;
  status: string;
}

export function BundleForm({ rulesets }: { rulesets: Ruleset[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleRuleset(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price) || 0,
        rulesetIds: Array.from(selectedIds),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Failed to create bundle");
    } else {
      router.push("/dashboard/bundles");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Bundle Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Ultimate Cursor Rules Pack"
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-green/40 focus:outline-none transition-colors resize-none"
          placeholder="What makes this bundle valuable?"
        />
      </div>

      <Input
        label="Price ($)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="19.99"
        min="0"
        step="0.01"
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Select Rulesets ({selectedIds.size} selected, min 2)
        </label>
        {rulesets.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rulesets.map((r) => (
              <label
                key={r.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIds.has(r.id)
                    ? "border-accent-green/40 bg-accent-green-subtle"
                    : "border-border-primary hover:border-border-hover"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => toggleRuleset(r.id)}
                  className="accent-accent-green"
                />
                <span className="text-sm text-text-primary flex-1 truncate">{r.title}</span>
                <span className="text-xs text-text-tertiary">
                  {r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">
            You need to create some rulesets first before bundling them.
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading || selectedIds.size < 2}>
        {loading ? "Creating..." : "Create Bundle"}
      </Button>
    </form>
  );
}
