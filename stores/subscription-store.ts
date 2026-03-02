import { create } from "zustand";
import type { SubscriptionRecord } from "@/types/subscription";

interface SubscriptionState {
  subscription: SubscriptionRecord | null;
  isLoading: boolean;
  setSubscription: (subscription: SubscriptionRecord | null) => void;
  setIsLoading: (value: boolean) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isLoading: false,
  setSubscription: (subscription) => set({ subscription }),
  setIsLoading: (value) => set({ isLoading: value }),
  reset: () => set({ subscription: null, isLoading: false }),
}));
