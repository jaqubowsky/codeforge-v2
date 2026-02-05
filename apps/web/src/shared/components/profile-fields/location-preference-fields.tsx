"use client";

import { type Control, Controller, type FieldErrors } from "react-hook-form";
import type { ProfileFormData } from "@/features/profile/schemas/profile";
import {
  FormError,
  FormLabel,
  FormSection,
  SelectableCard,
  SelectableCardDescription,
  SelectableCardTitle,
} from "@/shared/components/form";
import { WORK_LOCATION_OPTIONS } from "@/shared/constants/profile";

interface LocationPreferenceFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  showHeader?: boolean;
}

export function LocationPreferenceFields({
  control,
  errors,
  showHeader = true,
}: LocationPreferenceFieldsProps) {
  const content = (
    <div className="space-y-2">
      <FormLabel required>Preferred Locations</FormLabel>
      <Controller
        control={control}
        name="preferredLocations"
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-2">
            {WORK_LOCATION_OPTIONS.map((option) => {
              const isChecked = field.value?.includes(option.value) ?? false;

              return (
                <SelectableCard
                  checked={isChecked}
                  id={`location-${option.value}`}
                  key={option.value}
                  layout="vertical"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...(field.value || []), option.value]);
                    } else {
                      field.onChange(
                        (field.value || []).filter((v) => v !== option.value)
                      );
                    }
                  }}
                >
                  <SelectableCardTitle>{option.label}</SelectableCardTitle>
                  <SelectableCardDescription>
                    {option.description}
                  </SelectableCardDescription>
                </SelectableCard>
              );
            })}
          </div>
        )}
      />
      <FormError message={errors.preferredLocations?.message} />
    </div>
  );

  if (showHeader) {
    return (
      <FormSection
        description="Choose your preferred work arrangements"
        title="Work Location"
      >
        {content}
      </FormSection>
    );
  }

  return content;
}
