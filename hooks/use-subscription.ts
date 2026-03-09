import { useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscription-store";
import type { SubscriptionRecord } from "@/types/subscription";

export function useSubscription() {
  const subscription = useSubscriptionStore((state) => state.subscription);
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const isLoading = useSubscriptionStore((state) => state.isLoading);
  const setSubscription = useSubscriptionStore((state) => state.setSubscription);
  const setSubscriptions = useSubscriptionStore((state) => state.setSubscriptions);
  const setIsLoading = useSubscriptionStore((state) => state.setIsLoading);
  const reset = useSubscriptionStore((state) => state.reset);

  const fetchSubscription = useCallback(async (productId?: string) => {
    setIsLoading(true);
    try {
      const url = productId ? `/api/subscriptions?productId=${productId}` : "/api/subscriptions";
      const response = await fetch(url);
      const result: { 
        success: boolean; 
        data?: { 
          subscription?: SubscriptionRecord;
          subscriptions?: SubscriptionRecord[];
        } 
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
  }, [reset, setIsLoading, setSubscription, setSubscriptions]);

  return { 
    subscription, 
    subscriptions,
    isLoading, 
    fetchSubscription 
  };
}
