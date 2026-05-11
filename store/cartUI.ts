import { create } from "zustand";

type CartUIStore = {
  isOpen: boolean;

  open: () => void;
  close: () => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

export const useCartUI = create<CartUIStore>((set) => ({
  isOpen: false,

  open: () =>
    set({
      isOpen: true,
    }),

  close: () =>
    set({
      isOpen: false,
    }),

  checkoutOpen: false,

  openCheckout: () =>
    set({
      checkoutOpen: true,
      isOpen: false,
    }),

  closeCheckout: () =>
    set({
      checkoutOpen: false,
    }),
}));
