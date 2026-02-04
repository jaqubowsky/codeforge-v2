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
import { SignupForm } from "@/features/auth";
import { AuthRedirect } from "@/shared/auth/auth-redirect";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={null}>
        <AuthRedirect redirectTo="/" requireAuth={false} />
      </Suspense>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email and password to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link className="text-primary hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
