import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./index.css";
import Providers from "@/shared/ui/providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jobzzz.jnalewajk.me"),
  title: "jobZ - AI-Powered Job Matching",
  description:
    "Stop scrolling through job boards. jobZ uses AI to match you with opportunities that actually fit your skills and career goals.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${dmSans.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <script
            data-website-id="1e530111-1295-4db2-82d3-a7e06dd509ed"
            defer
            src="https://umami.jnalewajk.me/script.js"
          />
        )}
      </head>
      <body>
        <Providers>
          <NuqsAdapter>{children}</NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
