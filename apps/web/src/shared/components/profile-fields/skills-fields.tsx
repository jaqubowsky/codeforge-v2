"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Combobox } from "@codeforge-v2/ui/components/combobox";
import { X } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { FormError, FormLabel, FormSection } from "@/shared/components/form";
import type { ProfileFormData } from "@/shared/schemas/profile";

interface SkillsFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  technologies: Array<{ id: number; name: string }>;
  loading?: boolean;
  showHeader?: boolean;
}

export function SkillsFields({
  control,
  errors,
  technologies,
  loading = false,
  showHeader = true,
}: SkillsFieldsProps) {
  const options = technologies.map((tech) => ({
    value: tech.name,
    label: tech.name,
  }));

  const content = (
    <div className="space-y-2">
      <FormLabel required>Skills</FormLabel>
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <>
            <Combobox
              creatable
              createText="Add"
              emptyText="Type to add a skill"
              onChange={field.onChange}
              options={options}
              placeholder={
                loading ? "Loading suggestions..." : "Search or add skills..."
              }
              searchPlaceholder="Type a skill..."
              value={field.value}
            />
            {field.value.length > 0 && (
              <div className="mt-3 space-y-2">
                <FormLabel>Selected Skills ({field.value.length})</FormLabel>
                <div className="flex flex-wrap gap-1.5">
                  {field.value.map((skill) => (
                    <Badge
                      className="gap-1 pr-1"
                      key={skill}
                      variant="secondary"
                    >
                      {skill}
                      <button
                        aria-label={`Remove ${skill}`}
                        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-muted"
                        onClick={() =>
                          field.onChange(field.value.filter((s) => s !== skill))
                        }
                        type="button"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      />
      <FormError message={errors.skills?.message} />
    </div>
  );

  if (showHeader) {
    return (
      <FormSection
        description="Add at least 3 technologies you're proficient in"
        title="Your Skills"
      >
        {content}
      </FormSection>
    );
  }

  return content;
}
