"use client";

import { Briefcase } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";
import { SkillsFields } from "@/shared/components/profile-fields/skills-fields";
import { ColoredSectionCard } from "@/shared/components/ui/colored-section-card";
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
    <ColoredSectionCard
      color="emerald"
      description="Technologies you work with"
      icon={Briefcase}
      title="Technical Skills"
    >
      <SkillsFields
        control={control}
        errors={errors}
        loading={loadingTechnologies}
        showHeader={false}
        technologies={technologies}
      />
    </ColoredSectionCard>
  );
}
