import type { Metadata } from "next";
import {
  LandingBenefits,
  LandingCta,
  LandingFaq,
  LandingFooter,
  LandingHero,
  LandingHowItWorks,
  LandingNavbar,
  LandingTestimonials,
} from "@/features/landing";

export const metadata: Metadata = {
  title: "jobZ - AI-Powered Job Matching for Developers",
  description:
    "Stop scrolling through irrelevant job listings. jobZ learns your profile and surfaces only the opportunities that actually fit your skills and career goals.",
  openGraph: {
    title: "jobZ - AI-Powered Job Matching for Developers",
    description:
      "Stop scrolling through irrelevant job listings. jobZ learns your profile and surfaces only the opportunities that actually fit.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 633,
        alt: "jobZ - AI-Powered Job Matching for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "jobZ - AI-Powered Job Matching for Developers",
    description:
      "Stop scrolling through irrelevant job listings. jobZ learns your profile and surfaces only the opportunities that actually fit.",
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <LandingHero />
      <LandingBenefits />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
