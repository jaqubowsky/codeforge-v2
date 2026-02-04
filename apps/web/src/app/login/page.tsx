import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@codeforge-v2/ui/components/card";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth={false} />
      </Suspense>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link className="text-primary hover:underline" href="/signup">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
