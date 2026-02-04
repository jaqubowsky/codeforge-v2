"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { BasicInfoFields } from "@/shared/components/profile-fields/basic-info-fields";
import type { OnboardingFormData } from "../schemas";

interface StepBasicInfoProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function StepBasicInfo({ control, errors }: StepBasicInfoProps) {
  return <BasicInfoFields control={control} errors={errors} />;
}
