"use client";

import { useState, useEffect, useRef } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export function TagInput({ value, onChange, max = 5 }: TagInputProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (input.length < 1) {
      // Clear suggestions asynchronously to avoid sync setState in effect
      const id = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(id);
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/tags/search?q=${encodeURIComponent(input)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.data.filter((t: { name: string }) => !value.includes(t.name)));
      }
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [input, value]);

  function addTag(name: string) {
    const normalized = name.toLowerCase().trim();
    if (!normalized || value.includes(normalized) || value.length >= max) return;
    onChange([...value, normalized]);
    setInput("");
    setShowSuggestions(false);
  }

  function removeTag(name: string) {
    onChange(value.filter((t) => t !== name));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">Tags</label>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-accent-purple-subtle text-accent-purple border border-accent-purple/30 rounded">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-white">&times;</button>
          </span>
        ))}
      </div>
      {value.length < max && (
        <div className="relative">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Add tags..."
            className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-border-primary rounded-md shadow-lg z-10">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onMouseDown={() => addTag(s.name)}
                  className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-text-tertiary">{value.length}/{max} tags</p>
    </div>
  );
}
