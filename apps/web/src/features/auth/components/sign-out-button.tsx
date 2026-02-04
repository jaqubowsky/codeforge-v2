"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/shared/supabase/client";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      disabled={loading}
      onClick={handleSignOut}
      size="sm"
      variant="ghost"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
