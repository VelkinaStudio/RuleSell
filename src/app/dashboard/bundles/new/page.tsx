import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New bundle",
};

export default function Page() {
  return (
    <div className="p-8 text-text-secondary">
      Page: /dashboard/bundles/new — replacement pending
    </div>
  );
}
