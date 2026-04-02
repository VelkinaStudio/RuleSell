"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "reset" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "sent" : "error");
    if (!res.ok) setErrorMsg("Something went wrong. Please try again.");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (res.ok) {
      setStatus("reset");
    } else {
      const data = await res.json();
      setErrorMsg(data.error?.message || "Reset failed");
      setStatus("error");
    }
  }

  return (
    <>
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl mb-2">
          Ruleset
          <span className="w-2 h-2 rounded-full bg-accent-green" />
        </Link>
        <h1 className="text-lg font-medium text-text-primary">
          {token ? "Set new password" : "Reset password"}
        </h1>
      </div>

      {status === "sent" && (
        <div className="p-3 text-sm text-status-success border border-status-success/30 bg-status-success/10 rounded-md text-center">
          If an account exists with that email, a reset link has been sent.
        </div>
      )}

      {status === "reset" && (
        <div className="text-center space-y-3">
          <p className="text-status-success">Password reset successfully!</p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 text-sm text-status-error border border-status-error/30 bg-status-error/10 rounded-md">
          {errorMsg}
        </div>
      )}

      {!token && status !== "sent" && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      {token && status !== "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-text-tertiary">
        <Link href="/login" className="text-accent-green hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm space-y-6">
        <Suspense fallback={<p className="text-text-secondary text-center">Loading...</p>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
