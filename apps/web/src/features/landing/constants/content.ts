import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";

export const HERO_CONTENT = {
  badge: "AI-Powered Job Matching",
  headline: "Stop Scrolling.",
  headlineAccent: "Start Matching.",
  subheadline:
    "Your skills deserve better than endless job board scrolling. LandIT learns your profile and surfaces only the opportunities that actually fit.",
  ctaPrimary: "Start Finding Jobs",
  ctaSecondary: "See How It Works",
};

export const BENEFITS: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blue" | "emerald" | "violet" | "amber";
}> = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description:
      "Our AI learns your skills, experience, and career goals to find jobs that actually fit your profile.",
    color: "blue",
  },
  {
    icon: Clock,
    title: "Save Hours Weekly",
    description:
      "No more scrolling through hundreds of irrelevant listings. Get a curated feed of opportunities that matter.",
    color: "emerald",
  },
  {
    icon: Target,
    title: "One Dashboard",
    description:
      "Track all your applications in one place. Know exactly where you stand with every opportunity.",
    color: "violet",
  },
  {
    icon: TrendingUp,
    title: "Match Scores",
    description:
      "See how well each job matches your profile with clear percentage scores. Focus on the best fits.",
    color: "amber",
  },
];

export const HOW_IT_WORKS: Array<{
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blue" | "emerald" | "violet";
}> = [
  {
    step: 1,
    icon: UserCheck,
    title: "Create Your Profile",
    description:
      "Tell us about your skills, experience level, and what you're looking for in your next role. Takes just 2 minutes.",
    color: "blue",
  },
  {
    step: 2,
    icon: Search,
    title: "AI Scans For You",
    description:
      "Our AI searches JustJoin.IT and analyzes every listing against your profile. We find the needles in the haystack.",
    color: "emerald",
  },
  {
    step: 3,
    icon: Zap,
    title: "Review & Apply",
    description:
      "Get a curated list ranked by match score. Save the best ones, archive the rest, and apply with confidence.",
    color: "violet",
  },
];

export const TESTIMONIALS: Array<{
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}> = [
  {
    quote:
      "I was spending 5+ hours every weekend scrolling through job boards. Now I spend 20 minutes reviewing perfectly matched opportunities. Game changer.",
    name: "Marta Kowalska",
    role: "Senior Frontend Developer",
    company: "Previously at Allegro",
    avatar: "MK",
  },
  {
    quote:
      "The match scores are surprisingly accurate. It's like having a recruiter who actually understands what I'm looking for.",
    name: "Jakub Nowak",
    role: "Fullstack Developer",
    company: "3 years experience",
    avatar: "JN",
  },
  {
    quote:
      "Finally, a job tool built by developers for developers. No fluff, just relevant opportunities delivered to my dashboard.",
    name: "Anna Wiśniewska",
    role: "Backend Engineer",
    company: "Currently job hunting",
    avatar: "AW",
  },
];

export const FAQ_ITEMS: Array<{
  question: string;
  answer: string;
}> = [
  {
    question: "Is LandIT free to use?",
    answer:
      "Yes! LandIT is completely free during our launch phase. We're focused on building the best job matching experience for developers.",
  },
  {
    question: "Which job boards do you support?",
    answer:
      "Currently, we scan JustJoin.IT, one of Poland's largest tech job boards. We're actively working on adding more sources including NoFluffJobs and international boards.",
  },
  {
    question: "How accurate is the AI matching?",
    answer:
      "Our AI achieves over 80% accuracy in matching relevant jobs to user profiles. The more detailed your profile, the better your matches. You can also provide feedback to improve results over time.",
  },
  {
    question: "How do I update my profile?",
    answer:
      "You can update your profile anytime from your dashboard. Changes to your skills, experience, or preferences are immediately reflected in your job matches.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use Supabase for secure authentication and data storage. Your profile data is only used to match you with relevant jobs and is never shared with third parties.",
  },
  {
    question: "How often are new jobs added?",
    answer:
      "You can trigger a job scan anytime from your dashboard. Each scan analyzes the latest listings and adds new matches based on your profile.",
  },
];

export const CTA_CONTENT = {
  headline: "Ready to Find Your Perfect Role?",
  subheadline:
    "Join hundreds of developers who stopped scrolling and started matching. Your dream job is waiting.",
  button: "Get Started Free",
};

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#benefits" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const NAV_LINKS = [
  { label: "Features", href: "#benefits" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];
