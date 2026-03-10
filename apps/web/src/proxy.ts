import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/shared/supabase/session";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "Email link has expired. Please sign up again.",
  access_denied: "Access denied. Please try again.",
};

export async function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const errorCode = searchParams.get("error_code");

  if (errorCode) {
    const message =
      AUTH_ERROR_MESSAGES[errorCode] ??
      searchParams.get("error_description")?.replaceAll("+", " ") ??
      "Authentication failed. Please try again.";

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", message);
    return NextResponse.redirect(loginUrl);
  }

  const { supabaseResponse } = await updateSession(request);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
