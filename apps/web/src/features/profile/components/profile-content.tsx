import { YEARS_EXPERIENCE_OPTIONS } from "@/shared/constants/profile";
import { getProfile } from "../api";
import type { ProfileFormData } from "../schemas";
import { ProfileForm } from "./profile-form";

export async function ProfileContent() {
  const result = await getProfile();

  if (!(result.success && result.data)) {
    return (
      <div className="container max-w-3xl px-6 py-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-destructive">
            {result.error || "Failed to load profile data"}
          </p>
        </div>
      </div>
    );
  }

  const { data: profile } = result;

  const yearsExpValue =
    YEARS_EXPERIENCE_OPTIONS.find(
      (opt) => opt.numericValue === profile.years_experience
    )?.value ?? "0-1";

  const initialData: ProfileFormData = {
    jobTitle: profile.job_title ?? "",
    yearsExperience: yearsExpValue,
    skills: profile.skills ?? [],
    idealRoleDescription: profile.ideal_role_description ?? "",
  };

  return (
    <div className="w-full px-6 py-8">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
