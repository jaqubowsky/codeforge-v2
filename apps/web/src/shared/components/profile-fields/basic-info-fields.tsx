"use client";

import { Input } from "@codeforge-v2/ui/components/input";
import { Label } from "@codeforge-v2/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codeforge-v2/ui/components/select";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import type { ProfileFormData } from "@/features/profile/schemas";
import { YEARS_EXPERIENCE_OPTIONS } from "@/shared/constants/profile";

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
  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h3 className="font-semibold text-lg">Basic Information</h3>
          <p className="text-muted-foreground text-sm">
            Tell us about your professional background
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="jobTitle">
          Job Title <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <Input
              {...field}
              aria-invalid={!!errors.jobTitle}
              id="jobTitle"
              placeholder="e.g., Senior Frontend Developer"
            />
          )}
        />
        {errors.jobTitle && (
          <p className="text-destructive text-sm">{errors.jobTitle.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsExperience">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="yearsExperience"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                aria-invalid={!!errors.yearsExperience}
                id="yearsExperience"
              >
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_EXPERIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.yearsExperience && (
          <p className="text-destructive text-sm">
            {errors.yearsExperience.message}
          </p>
        )}
      </div>
    </div>
  );
}
