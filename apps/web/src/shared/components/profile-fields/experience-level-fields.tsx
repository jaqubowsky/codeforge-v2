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
import { EXPERIENCE_LEVEL_OPTIONS } from "@/shared/constants/profile";

interface ExperienceLevelFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  showHeader?: boolean;
}

export function ExperienceLevelFields({
  control,
  errors,
  showHeader = true,
}: ExperienceLevelFieldsProps) {
  const content = (
    <div className="space-y-2">
      <FormLabel required>Experience Levels</FormLabel>
      <Controller
        control={control}
        name="experienceLevel"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVEL_OPTIONS.map((option) => {
              const isChecked = field.value?.includes(option.value) ?? false;

              return (
                <SelectableCard
                  checked={isChecked}
                  id={`experience-${option.value}`}
                  key={option.value}
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
                  <div className="min-w-0 flex-1">
                    <SelectableCardTitle>{option.label}</SelectableCardTitle>
                    <SelectableCardDescription className="truncate">
                      {option.description}
                    </SelectableCardDescription>
                  </div>
                </SelectableCard>
              );
            })}
          </div>
        )}
      />
      <FormError message={errors.experienceLevel?.message} />
    </div>
  );

  if (showHeader) {
    return (
      <FormSection
        description="Select the experience levels you're interested in"
        title="Experience Level"
      >
        {content}
      </FormSection>
    );
  }

  return content;
}
