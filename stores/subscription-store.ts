import { create } from "zustand";
import type { SubscriptionRecord } from "@/types/subscription";

interface SubscriptionState {
  subscription: SubscriptionRecord | null;
  subscriptions: SubscriptionRecord[];
  isLoading: boolean;
  setSubscription: (subscription: SubscriptionRecord | null) => void;
  setSubscriptions: (subscriptions: SubscriptionRecord[]) => void;
  setIsLoading: (value: boolean) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  subscriptions: [],
  isLoading: false,
  setSubscription: (subscription) => set({ subscription }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setIsLoading: (value) => set({ isLoading: value }),
  reset: () => set({ subscription: null, subscriptions: [], isLoading: false }),
}));
