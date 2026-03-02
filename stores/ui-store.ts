import { create } from "zustand";
import type { ReactElement } from "react";

export interface ToastRecord {
  id: string;
  title?: string;
  description?: string;
  action?: ReactElement;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ModalState {
  id: string;
  props?: Record<string, unknown>;
}

interface UiState {
  modal: ModalState | null;
  toasts: ToastRecord[];
  openModal: (id: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  pushToast: (toast: ToastRecord) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  modal: null,
  toasts: [],
  openModal: (id, props) => set({ modal: { id, props } }),
  closeModal: () => set({ modal: null }),
  pushToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
