import { useSubscriptionStore } from "@/stores/subscription-store";
import { useUserStore } from "@/stores/user-store";
import type { SubscriptionRecord } from "@/types/subscription";
import { useCallback, useMemo } from "react";

export type SubscriptionTier = "guest" | "free" | "paid";

interface UseSubscriptionReturn {
  subscription: SubscriptionRecord | null;
  subscriptions: SubscriptionRecord[];
  isLoading: boolean;
  tier: SubscriptionTier;
  isGuest: boolean;
  isFree: boolean;
  isPaid: boolean;
  fetchSubscription: (productId?: string) => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
}

export function useSubscription(b: boolean = false): UseSubscriptionReturn {
  const subscription = useSubscriptionStore((state) => state.subscription);
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription,
  );
  const setSubscriptions = useSubscriptionStore(
    (state) => state.setSubscriptions,
  );
  const isGuest = useUserStore((state) => state.isGuest);
  const setIsLoading = useSubscriptionStore((state) => state.setIsLoading);
  const reset = useSubscriptionStore((state) => state.reset);

  const tier: SubscriptionTier = useMemo(() => {
    if (isGuest) return "guest";
    if (!subscription || subscription.planType === "free") return "free";
    return "paid";
  }, [isGuest, subscription]);

  const fetchSubscription = useCallback(
    async (productId?: string) => {
      setIsLoading(true);
      try {
        const url = productId
          ? `/api/subscriptions?productId=${productId}`
          : "/api/subscriptions";
        const response = await fetch(url);
        const result: {
          success: boolean;
          data?: {
            subscription?: SubscriptionRecord;
            subscriptions?: SubscriptionRecord[];
          };
        } = await response.json();

        if (response.ok && result.success) {
          if (productId && result.data?.subscription) {
            setSubscription(result.data.subscription);
          } else if (result.data?.subscriptions) {
            setSubscriptions(result.data.subscriptions);
          } else if (result.data?.subscription) {
            setSubscription(result.data.subscription);
          } else {
            reset();
          }
        } else {
          reset();
        }
      } catch {
        reset();
      } finally {
        setIsLoading(false);
      }
    },
    [reset, setIsLoading, setSubscription, setSubscriptions],
  );

  const setGuestMode = useCallback(
    (guest: boolean) => {
      if (guest) {
        reset();
      }
    },
    [reset],
  );

  return {
    subscription,
    subscriptions,
    isLoading,
    tier,
    isGuest,
    isFree: tier === "free",
    isPaid: tier === "paid",
    fetchSubscription,
    setGuestMode,
  };
}
