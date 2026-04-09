import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { LegalNav } from "@/components/legal/legal-nav";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-brand-fg"
      >
        Skip to content
      </a>
      <Header />
      <div className="flex-1 bg-bg">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LegalNav />
          </aside>
          <main id="main" className="min-w-0">
            <div className="mx-auto max-w-3xl">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
