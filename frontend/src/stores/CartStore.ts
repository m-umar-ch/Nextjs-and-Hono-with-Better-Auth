import { type StaticImageData } from "next/image";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CartItem = {
  id: number;
  name: string;
  price: number;
  noOfItems: number;
  img: string | StaticImageData;
};

type CartStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cartItems: CartItem[];
  addCartItem: (item: CartItem) => void;
  removeCartItem: (id: number, forceDelete?: "force-delete") => void;
  emptyCart: () => void;
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        open: false,
        setOpen: (data) => set({ open: data }),
        cartItems: [],
        emptyCart: () => set({ cartItems: [] }),
        addCartItem: (newItem) =>
          set((state) => {
            const existing = state.cartItems.find(
              (item) => item.id === newItem.id
            );
            if (!existing) {
              return {
                cartItems: [...state.cartItems, { ...newItem, noOfItems: 1 }],
              };
            } else {
              const items = state.cartItems.map((item) =>
                item.id === newItem.id
                  ? { ...item, noOfItems: item.noOfItems + 1 }
                  : item
              );
              return { cartItems: items };
            }
          }),
        removeCartItem: (id, forceDelete) =>
          set((state) => {
            const existing = state.cartItems.find((item) => item.id === id);
            if (existing) {
              if (existing.noOfItems <= 1 || forceDelete) {
                return {
                  cartItems: state.cartItems.filter((item) => item.id !== id),
                };
              } else {
                return {
                  cartItems: state.cartItems.map((item) =>
                    item.id === id
                      ? { ...item, noOfItems: item.noOfItems - 1 }
                      : item
                  ),
                };
              }
            }
            return state;
          }),
      }),
      { name: "cartStore" }
    )
  )
);
