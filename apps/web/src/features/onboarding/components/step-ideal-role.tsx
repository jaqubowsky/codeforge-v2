"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { IdealRoleFields } from "@/shared/components/profile-fields/ideal-role-fields";
import type { OnboardingFormData } from "../schemas/onboarding";

interface StepIdealRoleProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function StepIdealRole({ control, errors }: StepIdealRoleProps) {
  return <IdealRoleFields control={control} errors={errors} />;
}
