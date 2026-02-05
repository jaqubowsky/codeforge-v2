"use client";

import { Mail } from "lucide-react";
import { AuthInput, FormField, PrimaryButton } from "@/shared/components/form";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginForm() {
  const { email, setEmail, password, setPassword, loading, handleSubmit } =
    useLoginForm();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField htmlFor="email" label="Email">
          <AuthInput
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </FormField>

        <FormField htmlFor="password" label="Password">
          <AuthInput
            autoComplete="current-password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />
        </FormField>
      </div>

      <PrimaryButton
        loading={loading}
        loadingText="Signing in..."
        type="submit"
      >
        Sign in
      </PrimaryButton>
    </form>
  );
}
