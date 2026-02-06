import type { Database } from "@codeforge-v2/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Result } from "@/shared/api";
import { err, ok } from "@/shared/api";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing user sessions.
          }
        },
      },
    }
  );
}

export async function createAuthenticatedClient(): Promise<
  Result<{ supabase: SupabaseClient; userId: string }>
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return err("Not authenticated");
  }

  return ok({ supabase, userId: user.id });
}
