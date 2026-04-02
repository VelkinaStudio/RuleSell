import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export const metadata = { title: "Create account — Ruleset" };

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-xl mb-2">
            Ruleset
            <span className="w-2 h-2 rounded-full bg-accent-green" />
          </Link>
          <h1 className="text-lg font-medium text-text-primary">Create your account</h1>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
