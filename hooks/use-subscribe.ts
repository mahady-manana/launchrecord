import { useState } from "react";

interface SubscribeInput {
  priceId?: string;
}

export function useSubscribe() {
  const [isLoading, setIsLoading] = useState(false);

  const startSubscription = async (input: SubscribeInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result: { success: boolean; data?: { url: string }; message?: string } =
        await response.json();
      if (!response.ok || !result.success) {
        return { ok: false, error: result.message };
      }
      return { ok: true, url: result.data?.url };
    } catch {
      return { ok: false, error: "Unable to start checkout." };
    } finally {
      setIsLoading(false);
    }
  };

  return { startSubscription, isLoading };
}
