import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RuleSet AI — The Marketplace for AI Configurations",
  description:
    "Discover, share, and monetize AI rule sets, skills, MCPs, N8N workflows, and agent configs. Built by the community, for the community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
