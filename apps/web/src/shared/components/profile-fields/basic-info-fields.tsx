"use client";

import type { Control, FieldErrors } from "react-hook-form";
import type { ProfileFormData } from "@/features/profile/schemas/profile";
import { FormSection } from "@/shared/components/form";
import { ExperienceLevelFields } from "./experience-level-fields";
import { LocationPreferenceFields } from "./location-preference-fields";

interface BasicInfoFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  showHeader?: boolean;
}

export function BasicInfoFields({
  control,
  errors,
  showHeader = true,
}: BasicInfoFieldsProps) {
  const content = (
    <div className="space-y-5">
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

  if (showHeader) {
    return (
      <FormSection
        description="Tell us about your professional preferences"
        title="Preferences"
      >
        {content}
      </FormSection>
    );
  }

  return content;
}
