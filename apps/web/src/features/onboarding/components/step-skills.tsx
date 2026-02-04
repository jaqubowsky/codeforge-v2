"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { SkillsFields } from "@/shared/components/profile-fields/skills-fields";
import { useTechnologies } from "@/shared/hooks/use-technologies";
import type { OnboardingFormData } from "../schemas";

interface StepSkillsProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function StepSkills({ control, errors }: StepSkillsProps) {
  const { technologies, loading } = useTechnologies();

  return (
    <SkillsFields
      control={control}
      errors={errors}
      loading={loading}
      technologies={technologies}
    />
  );
}
