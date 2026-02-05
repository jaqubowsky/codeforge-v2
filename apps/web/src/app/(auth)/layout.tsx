import { Suspense } from "react";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/dashboard" requireAuth={false} />
      </Suspense>
      {children}
    </>
  );
}
