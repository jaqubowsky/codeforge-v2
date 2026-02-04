import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@codeforge-v2/ui/components/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth";
import { getAuthState } from "@/shared/auth/get-auth-state";

export default async function LoginPage() {
  const authState = await getAuthState();

  if (authState.authenticated) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
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
