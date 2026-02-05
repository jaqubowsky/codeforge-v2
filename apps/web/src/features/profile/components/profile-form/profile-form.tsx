"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Text } from "@codeforge-v2/ui/components/text";
import { Sparkles } from "lucide-react";
import type { ProfileData } from "../../types/profile";
import { ProfileBasicInfoSection } from "../profile-basic-info-section";
import { ProfileCareerGoalsSection } from "../profile-career-goals-section";
import { ProfileSkillsSection } from "../profile-skills-section";
import { useProfileForm } from "./use-profile-form";

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

      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <Text as="span" muted variant="mono-sm">
            Changes will regenerate your AI profile for better job matching
          </Text>
        </div>
        <Button disabled={isSubmitting} size="lg" type="submit" variant="dark">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
