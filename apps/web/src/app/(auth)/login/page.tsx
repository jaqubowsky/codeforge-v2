import Link from "next/link";
import { AuthLayout, LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
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
  );
}
