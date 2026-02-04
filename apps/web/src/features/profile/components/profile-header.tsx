import { Badge } from "@codeforge-v2/ui/components/badge";
import { Sparkles } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Your Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update your professional information to improve job matching
        </p>
      </div>
      <Badge className="bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400">
        <Sparkles className="mr-1 h-3 w-3" />
        AI Powered
      </Badge>
    </div>
  );
}
