import { redirect } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BrowseNewPage({ params }: PageProps) {
  const { locale } = await params;
  redirect({ href: "/browse?tab=new", locale });
}
