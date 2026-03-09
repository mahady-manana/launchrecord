import { useState } from "react";

interface CancelSubscriptionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

interface CancelOptions {
  productId?: string;
  immediate?: boolean;
  feedback?: {
    reason: string;
    feedback: string;
  };
}

export function useCancelSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubscription = async (options?: CancelOptions): Promise<CancelSubscriptionResult> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options || {}),
      });
      const result: { 
        success: boolean; 
        message?: string; 
        error?: string 
      } = await response.json();
      
      if (!response.ok || !result.success) {
        return { ok: false, error: result.error || "Unable to cancel subscription" };
      }
      
      return { ok: true, message: result.message };
    } catch {
      return { ok: false, error: "Unable to cancel subscription." };
    } finally {
      setIsLoading(false);
    }
  };

  return { cancelSubscription, isLoading };
}
