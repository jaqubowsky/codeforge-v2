import Link from "next/link";
import { AuthLayout, GoogleSignInButton, SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
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

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-border/50 border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <GoogleSignInButton />
    </AuthLayout>
  );
}
