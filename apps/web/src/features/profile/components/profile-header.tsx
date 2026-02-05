import { Badge } from "@codeforge-v2/ui/components/badge";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";

export function ProfileHeader() {
  return (
    <PageHeader
      action={
        <Badge>
          <Sparkles className="mr-1 h-3 w-3" />
          AI Powered
        </Badge>
      }
      description="Update your professional information to improve job matching"
      title="Your Profile"
    />
  );
}
