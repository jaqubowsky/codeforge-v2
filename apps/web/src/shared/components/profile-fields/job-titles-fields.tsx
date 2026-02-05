"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Button } from "@codeforge-v2/ui/components/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import type { ProfileFormData } from "@/features/profile/schemas";
import {
  FormDescription,
  FormError,
  FormInput,
  FormLabel,
  FormSection,
} from "@/shared/components/form";

interface JobTitlesFieldsProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  showHeader?: boolean;
}

export function JobTitlesFields({
  control,
  errors,
  showHeader = true,
}: JobTitlesFieldsProps) {
  const [inputValue, setInputValue] = useState("");

  const content = (
    <div className="space-y-2">
      <FormLabel required>Job Titles</FormLabel>
      <Controller
        control={control}
        name="jobTitles"
        render={({ field }) => (
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <FormInput
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    e.preventDefault();
                    if (!field.value.includes(inputValue.trim())) {
                      field.onChange([...field.value, inputValue.trim()]);
                    }
                    setInputValue("");
                  }
                }}
                placeholder="e.g., Frontend Developer"
                value={inputValue}
              />
              <Button
                className="shrink-0"
                disabled={!inputValue.trim()}
                onClick={() => {
                  if (
                    inputValue.trim() &&
                    !field.value.includes(inputValue.trim())
                  ) {
                    field.onChange([...field.value, inputValue.trim()]);
                    setInputValue("");
                  }
                }}
                size="icon"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {field.value.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {field.value.map((title) => (
                  <Badge className="gap-1 pr-1" key={title} variant="secondary">
                    {title}
                    <button
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-muted"
                      onClick={() => {
                        field.onChange(field.value.filter((t) => t !== title));
                      }}
                      type="button"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      />
      <FormError message={errors.jobTitles?.message} />
      <FormDescription>
        Press Enter or click + to add roles you're interested in
      </FormDescription>
    </div>
  );

  if (showHeader) {
    return (
      <FormSection
        description="Add the job titles you're interested in"
        title="Job Titles"
      >
        {content}
      </FormSection>
    );
  }

  return content;
}
