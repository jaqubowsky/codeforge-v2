import Link from "next/link";
import { Suspense } from "react";
import { AuthLayout, LoginForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth={false} />
      </Suspense>
      <AuthLayout
        footer={
          <p>
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-primary transition-colors hover:text-primary/80"
              href="/signup"
            >
              Sign up
            </Link>
          </p>
        }
        subtitle="Enter your credentials to access your dashboard"
        title="Welcome back"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
}
