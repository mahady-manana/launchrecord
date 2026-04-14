import type { UserRecord } from "@/types/user";
import { create } from "zustand";

interface UserState {
  users: UserRecord[];
  isLoading: boolean;
  setUsers: (users: UserRecord[]) => void;
  isGuest: boolean;
  setIsGuest: (b: boolean) => void;
  setIsLoading: (value: boolean) => void;
  addUser: (user: UserRecord) => void;
  updateUser: (user: UserRecord) => void;
  removeUser: (id: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  isGuest: false,
  setIsGuest(b) {
    set({
      isGuest: b,
    });
  },
  setUsers: (users) => set({ users }),
  setIsLoading: (value) => set({ isLoading: value }),
  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users],
    })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((item) => (item.id === user.id ? user : item)),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((item) => item.id !== id),
    })),
  reset: () => set({ users: [], isLoading: false }),
}));
