"use client";

import { User } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { BasicInfoFields } from "@/shared/components/profile-fields/basic-info-fields";
import { ColoredSectionCard } from "@/shared/components/ui/colored-section-card";
import type { ProfileFormData } from "../schemas/profile";

interface ProfileBasicInfoSectionProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export function ProfileBasicInfoSection({
  control,
  errors,
}: ProfileBasicInfoSectionProps) {
  return (
    <ColoredSectionCard
      color="blue"
      description="Your professional identity"
      icon={User}
      title="Basic Information"
    >
      <BasicInfoFields control={control} errors={errors} showHeader={false} />
    </ColoredSectionCard>
  );
}
