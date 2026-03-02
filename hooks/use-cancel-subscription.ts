import { useState } from "react";

export function useCancelSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      });
      const result: { success: boolean; message?: string } =
        await response.json();
      if (!response.ok || !result.success) {
        return { ok: false, error: result.message };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Unable to cancel subscription." };
    } finally {
      setIsLoading(false);
    }
  };

  return { cancelSubscription, isLoading };
}
