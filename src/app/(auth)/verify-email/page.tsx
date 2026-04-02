"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <>
      {status === "loading" && <p className="text-text-secondary">Verifying your email...</p>}

      {status === "success" && (
        <>
          <h1 className="text-lg font-medium text-status-success">Email verified!</h1>
          <p className="text-text-secondary text-sm">Your email has been verified. You can now sign in.</p>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-lg font-medium text-status-error">Verification failed</h1>
          <p className="text-text-secondary text-sm">Invalid or expired token. Please try again.</p>
          <Link href="/login">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl">
          Ruleset
          <span className="w-2 h-2 rounded-full bg-accent-green" />
        </Link>
        <Suspense fallback={<p className="text-text-secondary">Loading...</p>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
