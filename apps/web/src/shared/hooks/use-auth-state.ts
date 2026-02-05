"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setState({
          isAuthenticated: !!session,
          isLoading: false,
        });
      })
      .catch(() => {
        setState({
          isAuthenticated: false,
          isLoading: false,
        });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        isAuthenticated: !!session,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
