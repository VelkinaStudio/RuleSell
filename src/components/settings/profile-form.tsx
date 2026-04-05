"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileData {
  name: string;
  username: string;
  email: string;
  bio: string | null;
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio: bio || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Update failed");
    } else {
      setMessage("Profile updated");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {error && (
        <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 text-sm text-accent-green border border-accent-green/30 bg-accent-green-subtle rounded-md">
          {message}
        </div>
      )}

      <Input label="Email" value={profile.email} disabled />
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={3}
        maxLength={30}
      />
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-green/40 focus:outline-none transition-colors resize-none"
          placeholder="Tell people about yourself..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
