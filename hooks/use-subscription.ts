import { useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscription-store";
import type { SubscriptionRecord } from "@/types/subscription";

export function useSubscription() {
  const subscription = useSubscriptionStore((state) => state.subscription);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const setSubscription = useSubscriptionStore((state) => state.setSubscription);
  const setIsLoading = useSubscriptionStore((state) => state.setIsLoading);
  const reset = useSubscriptionStore((state) => state.reset);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscriptions");
      const result: { success: boolean; data?: { subscription: SubscriptionRecord } } =
        await response.json();
      if (response.ok && result.success && result.data?.subscription) {
        setSubscription(result.data.subscription);
      } else {
        reset();
      }
    } catch {
      reset();
    } finally {
      setIsLoading(false);
    }
  }, [reset, setIsLoading, setSubscription]);

  return { subscription, isLoading, fetchSubscription };
}
