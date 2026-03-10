"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/shared/supabase/client";

const PASSWORD_MIN_LENGTH = 6;

export function useSignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = hasMinLength && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (!hasMinLength) {
      toast.error(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      );
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    router.push("/onboarding");
    router.refresh();
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    hasMinLength,
    passwordsMatch,
    isValid,
    handleSubmit,
    PASSWORD_MIN_LENGTH,
  };
}
