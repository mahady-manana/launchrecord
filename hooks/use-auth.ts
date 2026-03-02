import { useAuthStore } from "@/stores/auth-store";
import type { SessionUser } from "@/types/user";
import { signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const reset = useAuthStore((state) => state.reset);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        reset();
        return;
      }
      const result: { success: boolean; data?: { user: SessionUser } } =
        await response.json();
      if (!result.success || !result.data?.user) {
        reset();
        return;
      }
      setUser(result.data.user);
      setIsAuthenticated(true);
    } catch {
      reset();
    }
  }, [reset, setIsAuthenticated, setUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setIsLoading(false);
        return { ok: false, error: result.error };
      }

      await refreshSession();
      setIsLoading(false);
      return { ok: true };
    },
    [refreshSession, setIsLoading],
  );

  const register = useCallback(
    async ({ name, email, password }: RegisterInput) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const result: { success: boolean; message?: string } =
          await response.json();
        if (!response.ok || !result.success) {
          setIsLoading(false);
          return { ok: false, error: result.message || "Registration failed" };
        }
        setIsLoading(false);
        return { ok: true };
      } catch {
        setIsLoading(false);
        return { ok: false, error: "Registration failed" };
      }
    },
    [setIsLoading],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    reset();
  }, [reset, setIsLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshSession,
  };
}
