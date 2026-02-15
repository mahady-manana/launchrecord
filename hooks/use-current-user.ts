// hooks/use-current-user.ts
import { useCallback } from "react";
import { useUserStore } from "@/stores/use-user.store";
import { userService } from "@/services/user-service";

export const useCurrentUser = () => {
  const setUser = useUserStore(state => state.setUser);
  const setAuthStatus = useUserStore(state => state.setAuthStatus);
  const user = useUserStore(state => state.user);
  const authStatus = useUserStore(state => state.authStatus);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setAuthStatus("authenticated");
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
      setAuthStatus("unauthenticated");
    }
  }, [setUser, setAuthStatus]);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
      setUser(null);
      setAuthStatus("unauthenticated");
    } catch (error) {
      console.error("Error during logout:", error);
      setUser(null);
      setAuthStatus("unauthenticated");
    }
  }, [setUser, setAuthStatus]);

  const clearUser = useCallback(() => {
    setUser(null);
    setAuthStatus("unauthenticated");
  }, [setUser, setAuthStatus]);

  return {
    user,
    authStatus,
    refreshUser,
    logout,
    clearUser,
  };
};

// Hook to initialize user on mount
export const useInitializeUser = () => {
  const { refreshUser } = useCurrentUser();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
};