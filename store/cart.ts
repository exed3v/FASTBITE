import { create } from "zustand";

import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  nombre: string;
  precio: number;
  imagen_url: string | null;
  cantidad: number;
};

type CartStore = {
  items: CartItem[];
  add: (item: Omit<CartItem, "cantidad">) => void;
  remove: (id: string) => void;
  setQty: (id: string, cantidad: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const found = state.items.find((cartItem) => cartItem.id === item.id);

          if (found) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      cantidad: cartItem.cantidad + 1,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                cantidad: 1,
              },
            ],
          };
        }),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setQty: (id, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        cantidad,
                      }
                    : item,
                ),
        })),

      clear: () =>
        set({
          items: [],
        }),

      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),

      count: () => get().items.reduce((acc, item) => acc + item.cantidad, 0),
    }),
    {
      name: "fastbite-cart",
    },
  ),
);
