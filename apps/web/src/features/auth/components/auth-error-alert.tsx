"use client";

import { AlertCircle } from "lucide-react";

interface AuthErrorAlertProps {
  message?: string;
}

export function AuthErrorAlert({ message }: AuthErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-5 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive text-sm">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
