import { notFound } from "next/navigation";

import { categoryFromSlug } from "@/constants/categories";
import { redirect } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  redirect({ href: `/browse?category=${category}`, locale });
}
