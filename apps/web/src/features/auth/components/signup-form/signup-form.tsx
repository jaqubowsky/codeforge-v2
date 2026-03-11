"use client";

import { Check, Mail, X } from "lucide-react";
import { AuthInput, FormField, PrimaryButton } from "@/shared/components/form";
import { useSignupForm } from "./use-signup-form";

interface PasswordRequirementProps {
  met: boolean;
  label: string;
}

function PasswordRequirement({ met, label }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground/50" />
      )}
      <span className={met ? "text-success" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
}

export function SignupForm() {
  const {
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
  } = useSignupForm();

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
            autoComplete="new-password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            type="password"
            value={password}
          />
        </FormField>

        <FormField htmlFor="confirmPassword" label="Confirm Password">
          <AuthInput
            autoComplete="new-password"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            type="password"
            value={confirmPassword}
          />
        </FormField>

        {password.length > 0 && (
          <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
            <PasswordRequirement
              label={`At least ${PASSWORD_MIN_LENGTH} characters`}
              met={hasMinLength}
            />
            <PasswordRequirement label="Passwords match" met={passwordsMatch} />
          </div>
        )}
      </div>

      <PrimaryButton
        data-umami-event="signup-submit"
        disabled={!isValid}
        loading={loading}
        loadingText="Creating account..."
        type="submit"
      >
        Create account
      </PrimaryButton>
    </form>
  );
}
