import { useState } from "react";

interface StripeCheckoutInput {
  mode: "subscription" | "payment";
  priceId?: string;
  amount?: number;
  currency?: string;
}

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = async (input: StripeCheckoutInput) => {
    setIsLoading(true);
    const endpoint =
      input.mode === "subscription"
        ? "/api/stripe/checkout/subscription"
        : "/api/stripe/checkout/payment";

    try {
      const response = await fetch(endpoint, {
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

  return { startCheckout, isLoading };
}
