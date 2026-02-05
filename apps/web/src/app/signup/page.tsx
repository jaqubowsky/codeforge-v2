import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout, SignupForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function SignupPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth={false} />
      </Suspense>
      <AuthLayout
        footer={
          <p>
            Already have an account?{" "}
            <Link
              className="font-medium text-primary transition-colors hover:text-primary/80"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        }
        subtitle="Create your account to start tracking job opportunities"
        title="Get started"
      >
        <SignupForm />
      </AuthLayout>
    </>
  );
}
