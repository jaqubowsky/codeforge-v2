"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Sparkles } from "lucide-react";
import { useProfileForm } from "../hooks/use-profile-form";
import type { ProfileData } from "../types";
import { ProfileBasicInfoSection } from "./profile-basic-info-section";
import { ProfileCareerGoalsSection } from "./profile-career-goals-section";
import { ProfileSkillsSection } from "./profile-skills-section";

interface ProfileFormProps {
  initialData: ProfileData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { control, errors, isSubmitting, handleSubmit, onSubmit } =
    useProfileForm({ initialData });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <ProfileBasicInfoSection control={control} errors={errors} />
      <ProfileSkillsSection control={control} errors={errors} />
      <ProfileCareerGoalsSection control={control} errors={errors} />

      <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <span>
            Changes will regenerate your AI profile for better job matching
          </span>
        </div>
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
