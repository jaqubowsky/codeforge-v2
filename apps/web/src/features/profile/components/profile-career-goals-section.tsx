"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@codeforge-v2/ui/components/card";
import { Target } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { IdealRoleFields } from "@/shared/components/profile-fields/ideal-role-fields";
import type { ProfileFormData } from "../schemas";

interface ProfileCareerGoalsSectionProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export function ProfileCareerGoalsSection({
  control,
  errors,
}: ProfileCareerGoalsSectionProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-violet-500">
      <CardHeader className="bg-gradient-to-r from-violet-50/50 to-transparent dark:from-violet-950/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white dark:bg-violet-500">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Career Goals</h2>
            <p className="text-muted-foreground text-xs">
              What you're looking for next
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <IdealRoleFields control={control} errors={errors} showHeader={false} />
      </CardContent>
    </Card>
  );
}
