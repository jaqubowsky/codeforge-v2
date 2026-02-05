import Link from "next/link";
import { AuthLayout, SignupForm } from "@/features/auth";

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
    </AuthLayout>
  );
}
