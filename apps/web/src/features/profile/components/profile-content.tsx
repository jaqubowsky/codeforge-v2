import { ErrorDisplay } from "@/shared/components/ui/error-display";
import { PageHero, PageHeroHeader } from "@/shared/components/ui/page-hero";
import { getProfile } from "../api";
import { ProfileForm } from "./profile-form";

export async function ProfileContent() {
  const result = await getProfile();

  if (!result.success) {
    return (
      <div className="container max-w-4xl px-6 py-8">
        <ErrorDisplay message={result.error} />
      </div>
    );
  }

  return (
    <>
      <PageHero>
        <PageHeroHeader
          description="Update your professional information to improve job matching"
          title="Your Profile"
        />
      </PageHero>
      <div className="container max-w-4xl px-6 py-8">
        <ProfileForm initialData={result.data} />
      </div>
    </>
  );
}
