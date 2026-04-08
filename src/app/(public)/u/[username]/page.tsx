import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User profile",
};

export default function Page() {
  return (
    <div className="p-8 text-text-secondary">
      Page: /u/[username] — replacement pending
    </div>
  );
}
