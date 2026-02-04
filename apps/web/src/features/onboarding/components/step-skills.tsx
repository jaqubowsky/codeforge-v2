"use client";

import { Badge } from "@codeforge-v2/ui/components/badge";
import { Combobox } from "@codeforge-v2/ui/components/combobox";
import { Label } from "@codeforge-v2/ui/components/label";
import { X } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { useTechnologies } from "../hooks/use-technologies";
import type { OnboardingFormData } from "../schemas";

interface StepSkillsProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export function StepSkills({ control, errors }: StepSkillsProps) {
  const { technologies, loading } = useTechnologies();

  const options = technologies.map((tech) => ({
    value: tech.name,
    label: tech.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Your Skills</h3>
        <p className="text-muted-foreground text-sm">
          Select at least 3 technologies you're proficient in
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">
          Skills <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <>
              <Combobox
                emptyText="No skills found."
                onChange={field.onChange}
                options={options}
                placeholder={
                  loading ? "Loading skills..." : "Search and select skills..."
                }
                searchPlaceholder="Search skills..."
                value={field.value}
              />
              {field.value.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Selected Skills ({field.value.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((skill) => (
                      <Badge className="gap-1" key={skill} variant="secondary">
                        {skill}
                        <button
                          aria-label={`Remove ${skill}`}
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((s) => s !== skill)
                            )
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
        {errors.skills && (
          <p className="text-destructive text-sm">{errors.skills.message}</p>
        )}
      </div>
    </div>
  );
}
