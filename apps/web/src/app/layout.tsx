import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./index.css";
import Providers from "@/shared/ui/providers";

export const metadata: Metadata = {
  title: "codeforge-v2",
  description: "codeforge-v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="antialiased" lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
