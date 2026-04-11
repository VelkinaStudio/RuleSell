"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { heroEntrance, heroChild } from "@/lib/motion/variants";

interface FieldErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  age?: string;
  terms?: string;
  form?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age18, setAge18] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<null | { emailSent: boolean }>(null);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!username.trim()) e.username = "Username is required";
    else if (username.length < 3) e.username = "At least 3 characters";
    else if (!/^[a-zA-Z0-9_-]+$/.test(username))
      e.username = "Letters, numbers, hyphens and underscores only";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Not a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters";
    if (!age18) e.age = "You must confirm you are 18 or older";
    if (!agreedTerms) e.terms = "Please accept the Terms and Privacy Policy";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErrors({});

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Field-level validation errors from the backend
        if (body?.error?.issues) {
          const fe: FieldErrors = {};
          for (const issue of body.error.issues) {
            if (issue.path) fe[issue.path as keyof FieldErrors] = issue.message;
          }
          setErrors(fe);
        } else if (body?.error?.message) {
          // Conflict / rate-limit / other backend errors
          const msg = String(body.error.message);
          if (msg.includes("email")) setErrors({ email: msg });
          else if (msg.includes("username")) setErrors({ username: msg });
          else setErrors({ form: msg });
        } else {
          setErrors({ form: "Something went wrong. Please try again." });
        }
        setLoading(false);
        return;
      }

      const emailSent = Boolean(body?.data?.emailSent);
      setSuccess({ emailSent });
      setLoading(false);
      // Redirect after a beat so users see the confirmation state
      setTimeout(
        () => {
          router.push(emailSent ? "/login?registered=1" : "/login?registered=noverify");
        },
        emailSent ? 2200 : 1600,
      );
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
        <motion.div
          className="w-full max-w-sm space-y-4 text-center"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brand size="lg" className="justify-center" />
          <div className="rounded-lg border border-brand/40 bg-brand/5 p-6 text-sm text-fg">
            <h2 className="font-display text-lg font-semibold text-fg">
              {success.emailSent ? "Check your email" : "Account created"}
            </h2>
            <p className="mt-2 text-fg-muted">
              {success.emailSent ? (
                <>
                  We&apos;ve sent a verification link to{" "}
                  <strong className="text-fg">{email}</strong>. Click it to activate
                  your account, then sign in.
                </>
              ) : (
                <>
                  Welcome to RuleSell. You can sign in now with{" "}
                  <strong className="text-fg">{email}</strong>.
                </>
              )}
            </p>
          </div>
          <p className="text-xs text-fg-muted">Redirecting to sign in…</p>
        </motion.div>
      </div>
    );
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
        {/* Brand */}
        <motion.div variants={heroChild} className="text-center">
          <Brand size="lg" className="justify-center" />
          <h1 className="mt-3 text-lg font-semibold text-fg">Create your account</h1>
          <p className="mt-1 text-xs text-fg-muted">
            Free forever. Upgrade when you&apos;re ready to sell.
          </p>
        </motion.div>

        {/* OAuth — fastest path */}
        <motion.div variants={heroChild} className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("github", { callbackUrl: "/dashboard/overview" })}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => signIn("google", { callbackUrl: "/dashboard/overview" })}
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
            Continue with Google
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={heroChild} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-soft" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg px-2 text-fg-muted">or with email</span>
          </div>
        </motion.div>

        {/* Email form */}
        <motion.form
          variants={heroChild}
          onSubmit={handleSubmit}
          className="space-y-3"
          noValidate
        >
          <Field
            label="Full name"
            id="name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            error={errors.name}
            autoComplete="name"
          />
          <Field
            label="Username"
            id="username"
            value={username}
            onChange={(v) => setUsername(v.replace(/\s+/g, "").toLowerCase())}
            placeholder="jane"
            error={errors.username}
            autoComplete="username"
            prefix="@"
          />
          <Field
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            error={errors.password}
            autoComplete="new-password"
          />

          {/* Compliance gates — 18+ and terms, required by DSA + US COPPA */}
          <div className="space-y-2 pt-1">
            <Checkbox
              id="age18"
              checked={age18}
              onChange={setAge18}
              error={errors.age}
            >
              I&apos;m 18 or older and legally able to agree to these terms.
            </Checkbox>
            <Checkbox
              id="terms"
              checked={agreedTerms}
              onChange={setAgreedTerms}
              error={errors.terms}
            >
              I agree to the{" "}
              <Link href="/legal/terms" className="text-brand underline hover:text-brand/80">
                Terms
              </Link>
              ,{" "}
              <Link href="/legal/privacy" className="text-brand underline hover:text-brand/80">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/legal/acceptable-use" className="text-brand underline hover:text-brand/80">
                Acceptable Use
              </Link>
              .
            </Checkbox>
          </div>

          {errors.form && (
            <p className="text-center text-sm text-danger">{errors.form}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-brand text-brand-fg hover:bg-brand/90"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </motion.form>

        <motion.p
          variants={heroChild}
          className="text-center text-xs text-fg-muted"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:text-brand/80">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

// Small subcomponents kept local to avoid leaking a half-formed API

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  prefix?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  prefix,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fg-dim">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "w-full rounded-lg border bg-bg-surface px-3 py-2.5 text-sm text-fg",
            "placeholder:text-fg-dim transition focus:outline-none focus:ring-1",
            error
              ? "border-danger focus:border-danger focus:ring-danger/50"
              : "border-border-soft focus:border-brand focus:ring-brand/50",
            prefix ? "pl-7" : "",
          ].join(" ")}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}

function Checkbox({ id, checked, onChange, error, children }: CheckboxProps) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2 text-xs text-fg-muted">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
        />
        <span className="leading-snug">{children}</span>
      </label>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
