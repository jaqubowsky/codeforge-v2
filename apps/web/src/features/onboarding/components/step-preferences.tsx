"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { ExperienceLevelFields } from "@/shared/components/profile-fields/experience-level-fields";
import { LocationPreferenceFields } from "@/shared/components/profile-fields/location-preference-fields";
import { SkillsFields } from "@/shared/components/profile-fields/skills-fields";
import { useTechnologies } from "@/shared/hooks/use-technologies";
import type { OnboardingFormData } from "../schemas";

interface StepPreferencesProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function StepPreferences({ control, errors }: StepPreferencesProps) {
  const { technologies, loading } = useTechnologies();

  return (
    <div className="space-y-6">
      <SkillsFields
        control={control}
        errors={errors}
        loading={loading}
        showHeader={false}
        technologies={technologies}
      />
      <ExperienceLevelFields
        control={control}
        errors={errors}
        showHeader={false}
      />
      <LocationPreferenceFields
        control={control}
        errors={errors}
        showHeader={false}
      />
    </div>
  );
}
