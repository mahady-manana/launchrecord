import { useAuthStore } from "@/stores/auth-store";
import type { SessionUser } from "@/types/user";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  callbackUrl?: string;
}

export function useAuth(required?: boolean) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const reset = useAuthStore((state) => state.reset);
  const { push } = useRouter();
  const logOutUser = () => {
    reset();
    if (required) {
      push("/login");
    }
  };
  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        logOutUser();
        return;
      }
      const result: { success: boolean; data?: { user: SessionUser } } =
        await response.json();
      if (!result.success || !result.data?.user) {
        logOutUser();
        return;
      }
      setUser(result.data.user);
      setIsAuthenticated(true);
    } catch {
      logOutUser();
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
    async ({ name, email, password, callbackUrl }: RegisterInput) => {
      setIsLoading(true);
      try {
        await signIn("credentials", {
          email,
          password,
          name,
          signup: "true",
          callbackUrl: callbackUrl || " /dashboard",
        });

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
