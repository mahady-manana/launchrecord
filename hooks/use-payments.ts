import { useCallback } from "react";
import { usePaymentStore } from "@/stores/payment-store";
import type { PaymentRecord } from "@/types/payment";

export function usePayments() {
  const payments = usePaymentStore((state) => state.payments);
  const isLoading = usePaymentStore((state) => state.isLoading);
  const setPayments = usePaymentStore((state) => state.setPayments);
  const setIsLoading = usePaymentStore((state) => state.setIsLoading);
  const reset = usePaymentStore((state) => state.reset);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments");
      const result: { success: boolean; data?: { payments: PaymentRecord[] } } =
        await response.json();
      if (response.ok && result.success && result.data?.payments) {
        setPayments(result.data.payments);
      } else {
        reset();
      }
    } catch {
      reset();
    } finally {
      setIsLoading(false);
    }
  }, [reset, setIsLoading, setPayments]);

  return { payments, isLoading, fetchPayments };
}
