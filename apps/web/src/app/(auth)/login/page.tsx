import Link from "next/link";
import { AuthLayout, LoginForm } from "@/features/auth";
import { AuthErrorAlert } from "@/features/auth/components/auth-error-alert";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

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
      <AuthErrorAlert message={error} />

      <LoginForm />
    </AuthLayout>
  );
}
