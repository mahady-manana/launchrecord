import { useState } from "react";

interface SubscribeInput {
  productId?: string;
  planType?: "onetime" | "founder";
  priceId?: string;
  redirectToSubscription?: boolean;
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
      const result: {
        success: boolean;
        data?: { url: string; sessionId: string };
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        return { ok: false, error: result.error || "Unable to start checkout" };
      }

      return {
        ok: true,
        url: result.data?.url,
        sessionId: result.data?.sessionId,
      };
    } catch (error) {
      console.error("Checkout error:", error);
      return { ok: false, error: "Unable to start checkout." };
    } finally {
      setIsLoading(false);
    }
  };

  return { startSubscription, isLoading };
}
