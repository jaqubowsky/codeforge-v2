"use client";

import { Toaster } from "@codeforge-v2/ui/components/sonner";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
      <Toaster
        closeButton
        duration={4000}
        expand={false}
        gap={8}
        offset={16}
        position="bottom-right"
        richColors
        visibleToasts={4}
      />
    </ThemeProvider>
  );
}
