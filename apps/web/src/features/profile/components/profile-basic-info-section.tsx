"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@codeforge-v2/ui/components/card";
import { User } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { BasicInfoFields } from "@/shared/components/profile-fields/basic-info-fields";
import type { ProfileFormData } from "../schemas";

interface ProfileBasicInfoSectionProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export function ProfileBasicInfoSection({
  control,
  errors,
}: ProfileBasicInfoSectionProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-500">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Basic Information</h2>
            <p className="text-muted-foreground text-xs">
              Your professional identity
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <BasicInfoFields control={control} errors={errors} showHeader={false} />
      </CardContent>
    </Card>
  );
}
