import { notFound } from "next/navigation";

import { environmentFromSlug } from "@/constants/environments";
import { redirect } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EnvironmentPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const env = environmentFromSlug(slug);
  if (!env) notFound();
  redirect({ href: `/browse?environment=${env}`, locale });
}
