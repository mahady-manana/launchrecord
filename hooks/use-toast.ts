"use client";

import { useUiStore } from "@/stores/ui-store";

interface ToastOptions {
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const pushToast = useUiStore((state) => state.pushToast);
  const removeToast = useUiStore((state) => state.removeToast);
  const toasts = useUiStore((state) => state.toasts);

  const showToast = (title: string, options?: ToastOptions) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    pushToast({
      id,
      title,
      description: options?.description,
      variant: options?.variant,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          removeToast(id);
        }
      },
    });
  };

  return { showToast, toasts };
}
