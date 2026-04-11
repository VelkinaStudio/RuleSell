"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { heroEntrance, heroChild } from "@/lib/motion/variants";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-xl font-bold tracking-tight">
            <span className="font-display text-brand">R</span>
            <span className="font-display text-fg">uleSell</span>
          </div>
          <h1 className="mt-3 text-lg font-semibold text-fg">
            Sign in to RuleSell
          </h1>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-full animate-pulse rounded-lg bg-bg-surface" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-bg-surface" />
        </div>
      </div>
    </div>
  );
}

function LoginContent() {
  const t = useTranslations("auth");
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
      {/* Subtle background treatment */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(255, 209, 102, 0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="w-full max-w-sm space-y-6"
        variants={heroEntrance}
        initial={reduce ? "visible" : "hidden"}
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={heroChild} className="text-center">
          <div className="inline-flex items-center gap-1 text-xl font-bold tracking-tight">
            <span className="font-display text-brand">R</span>
            <span className="font-display text-fg">uleSell</span>
          </div>
          <h1 className="mt-3 text-lg font-semibold text-fg">
            Sign in to RuleSell
          </h1>
        </motion.div>

        {/* OAuth buttons */}
        <motion.div variants={heroChild} className="space-y-2">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <Github className="h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("google", { callbackUrl })}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={heroChild} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-soft" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg px-2 text-fg-muted">or</span>
          </div>
        </motion.div>

        {/* Credentials form */}
        <motion.form
          variants={heroChild}
          onSubmit={handleCredentials}
          className="space-y-3"
        >
          {error && (
            <p className="text-center text-sm text-danger">{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-dim transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-border-soft bg-bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-dim transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
          <Button
            type="submit"
            className="w-full bg-brand text-brand-fg hover:bg-brand/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </motion.form>

        <motion.p
          variants={heroChild}
          className="text-center text-xs text-fg-muted"
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand hover:text-brand/80">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
