import { create } from "zustand";
import { AppUser } from "@/types";

interface UserStore {
  user: AppUser | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  setUser: (user: AppUser | null) => void;
  setAuthStatus: (status: UserStore["authStatus"]) => void;
  clear: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  authStatus: "loading",
  setUser: (user) => set({ user }),
  setAuthStatus: (authStatus) => set({ authStatus }),
  clear: () => set({ user: null, authStatus: "unauthenticated" }),
}));