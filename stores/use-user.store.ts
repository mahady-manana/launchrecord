import { create } from "zustand";
import { AppUser } from "@/types";

interface UserStore {
  user: AppUser | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  setUser: (user: AppUser | null) => void;
  setAuthStatus: (status: UserStore["authStatus"]) => void;
  refreshUser: () => Promise<void>;
  clear: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  authStatus: "loading",
  setUser: (user) => set({ user }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  refreshUser: async () => {
    try {
      const response = await fetch("/api/users/me", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        set({ user: null, authStatus: "unauthenticated" });
        return;
      }

      set({
        user: data.user,
        authStatus: "authenticated",
      });
    } catch (error) {
      console.error("Error refreshing user:", error);
      set({ user: null, authStatus: "unauthenticated" });
    }
  },
  clear: () => set({ user: null, authStatus: "unauthenticated" }),
}));
