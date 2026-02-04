"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { Sparkles } from "lucide-react";
import { useProfileForm } from "../hooks/use-profile-form";
import type { ProfileFormData } from "../schemas";
import { ProfileBasicInfoSection } from "./profile-basic-info-section";
import { ProfileCareerGoalsSection } from "./profile-career-goals-section";
import { ProfileHeader } from "./profile-header";
import { ProfileSkillsSection } from "./profile-skills-section";

interface ProfileFormProps {
  initialData: ProfileFormData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { control, errors, isSubmitting, handleSubmit, onSubmit } =
    useProfileForm({ initialData });

  return (
    <div className="space-y-8">
      <ProfileHeader />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <ProfileBasicInfoSection control={control} errors={errors} />
          <ProfileSkillsSection control={control} errors={errors} />
          <ProfileCareerGoalsSection control={control} errors={errors} />

          <div className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-slate-50 to-transparent p-4 dark:from-slate-900">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span>
                Changes will regenerate your AI profile for better job matching
              </span>
            </div>
            <Button
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
