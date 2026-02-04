"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/shared/supabase/client";

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to complete onboarding");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Welcome to Job Tracker!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          This is a placeholder for the full onboarding flow. In Milestone 2,
          you&apos;ll be able to add your job title, skills, and ideal role
          description here.
        </p>
        <p className="text-muted-foreground">
          For now, click the button below to complete your setup and access the
          dashboard.
        </p>
      </div>
      <Button
        className="w-full"
        disabled={loading}
        onClick={handleComplete}
        type="button"
      >
        {loading ? "Setting up..." : "Complete Setup"}
      </Button>
    </div>
  );
}
