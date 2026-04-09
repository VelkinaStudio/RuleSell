"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./auth-provider";
import { SWRProvider } from "./swr-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SWRProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
          <Toaster />
        </AuthProvider>
      </SWRProvider>
    </ThemeProvider>
  );
}
