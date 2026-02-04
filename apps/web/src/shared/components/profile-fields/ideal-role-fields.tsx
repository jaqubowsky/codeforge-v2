"use client";

import { Label } from "@codeforge-v2/ui/components/label";
import { Textarea } from "@codeforge-v2/ui/components/textarea";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { VALIDATION_RULES } from "@/shared/constants/profile";

interface IdealRoleFieldsProps {
  control: Control<{
    jobTitle: string;
    yearsExperience: "0-1" | "1-3" | "3-5" | "5-10" | "10+";
    skills: string[];
    idealRoleDescription: string;
  }>;
  errors: FieldErrors<{
    jobTitle: string;
    yearsExperience: "0-1" | "1-3" | "3-5" | "5-10" | "10+";
    skills: string[];
    idealRoleDescription: string;
  }>;
  showHeader?: boolean;
}

export function IdealRoleFields({
  control,
  errors,
  showHeader = true,
}: IdealRoleFieldsProps) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <h3 className="font-semibold text-lg">Your Ideal Role</h3>
          <p className="text-muted-foreground text-sm">
            Describe your dream job, preferred company culture, and technologies
            you want to work with
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="idealRole">
          Ideal Role Description <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="idealRoleDescription"
          render={({ field }) => {
            const characterCount = field.value.length;
            const isValid =
              characterCount >= VALIDATION_RULES.MIN_IDEAL_ROLE_CHARS;

            return (
              <>
                <Textarea
                  {...field}
                  aria-invalid={!!errors.idealRoleDescription}
                  className="resize-none"
                  id="idealRole"
                  placeholder="I'm looking for a role where I can..."
                  rows={6}
                />
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={
                      isValid ? "text-muted-foreground" : "text-destructive"
                    }
                  >
                    {characterCount} / {VALIDATION_RULES.MIN_IDEAL_ROLE_CHARS}{" "}
                    characters minimum
                  </span>
                </div>
              </>
            );
          }}
        />
        {errors.idealRoleDescription && (
          <p className="text-destructive text-sm">
            {errors.idealRoleDescription.message}
          </p>
        )}
      </div>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium">Tips for a great description:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Mention your preferred work environment (remote, hybrid, office)
          </li>
          <li>Include technologies you want to learn or use more</li>
          <li>Describe the type of projects that excite you</li>
          <li>Share your career goals and aspirations</li>
        </ul>
      </div>
    </div>
  );
}
