import { useUiStore } from "@/stores/ui-store";

export function useModal() {
  const modal = useUiStore((state) => state.modal);
  const openModal = useUiStore((state) => state.openModal);
  const closeModal = useUiStore((state) => state.closeModal);
  return { modal, openModal, closeModal };
}
