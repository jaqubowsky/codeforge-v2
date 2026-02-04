"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@codeforge-v2/ui/components/card";
import { Briefcase } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { SkillsFields } from "@/shared/components/profile-fields/skills-fields";
import { useTechnologies } from "@/shared/hooks/use-technologies";
import type { ProfileFormData } from "../schemas";

interface ProfileSkillsSectionProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export function ProfileSkillsSection({
  control,
  errors,
}: ProfileSkillsSectionProps) {
  const { technologies, loading: loadingTechnologies } = useTechnologies();

  return (
    <Card className="overflow-hidden border-l-4 border-l-emerald-500">
      <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white dark:bg-emerald-500">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Technical Skills</h2>
            <p className="text-muted-foreground text-xs">
              Technologies you work with
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <SkillsFields
          control={control}
          errors={errors}
          loading={loadingTechnologies}
          showHeader={false}
          technologies={technologies}
        />
      </CardContent>
    </Card>
  );
}
