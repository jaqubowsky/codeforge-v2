"use client";

import { Target } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { IdealRoleFields } from "@/shared/components/profile-fields/ideal-role-fields";
import { ColoredSectionCard } from "@/shared/components/ui/colored-section-card";
import type { ProfileFormData } from "../schemas/profile";

interface ProfileCareerGoalsSectionProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export function ProfileCareerGoalsSection({
  control,
  errors,
}: ProfileCareerGoalsSectionProps) {
  return (
    <ColoredSectionCard
      color="violet"
      description="What you're looking for next"
      icon={Target}
      title="Career Goals"
    >
      <IdealRoleFields control={control} errors={errors} showHeader={false} />
    </ColoredSectionCard>
  );
}
