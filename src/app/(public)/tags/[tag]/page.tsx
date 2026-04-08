import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tag",
};

export default function Page() {
  return (
    <div className="p-8 text-text-secondary">
      Page: /tags/[tag] — replacement pending
    </div>
  );
}
