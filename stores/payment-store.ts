import { create } from "zustand";
import type { PaymentRecord } from "@/types/payment";

interface PaymentState {
  payments: PaymentRecord[];
  isLoading: boolean;
  setPayments: (payments: PaymentRecord[]) => void;
  setIsLoading: (value: boolean) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  isLoading: false,
  setPayments: (payments) => set({ payments }),
  setIsLoading: (value) => set({ isLoading: value }),
  reset: () => set({ payments: [], isLoading: false }),
}));
