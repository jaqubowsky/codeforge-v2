import { ErrorDisplay } from "@/shared/components/ui/error-display";
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
    <div className="container max-w-4xl px-6 py-8">
      <ProfileForm initialData={result.data} />
    </div>
  );
}
