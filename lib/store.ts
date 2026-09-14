import { create } from "zustand";
import { CartItemType } from "./types";

interface CartState {
  products: CartItemType[];
  totalItems: number;
  totalPrice: number;
}

interface CartActions {
  addToCart: (item: CartItemType) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

const INITIAL_STATE: CartState = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};
export const useCartStore = create<CartStore>((set, get) => ({
  products: INITIAL_STATE.products,
  totalItems: INITIAL_STATE.totalItems,
  totalPrice: INITIAL_STATE.totalPrice,
  addToCart: (item: CartItemType) => {
    set((state: CartState) => {
      const existingItem = state.products.find(
        (product) => product.productVariantId === item.productVariantId,
      );
      let updatedProducts: CartItemType[];

      if (existingItem) {
        updatedProducts = state.products.map((p) =>
          p.productVariantId === item.productVariantId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        );
      } else {
        updatedProducts = [...state.products, item];
      }
      return {
        products: updatedProducts,
        totalItems: state.totalItems + item.quantity,
        totalPrice: state.totalPrice + item.priceAtPurchase * item.quantity,
      };
    });
  },
  removeFromCart: (variantId: string) => {
    set((state: CartState) => {
      const itemToRemove = state.products.find(
        (p) => p.productVariantId === variantId,
      );
      if (!itemToRemove) return state;

      return {
        products: state.products.filter(
          (p) => p.productVariantId !== variantId,
        ),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice:
          state.totalPrice -
          itemToRemove.priceAtPurchase * itemToRemove.quantity,
      };
    });
  },
  updateQuantity: (variantId: string, quantity: number) => {
    set((state: CartState) => {
      const itemToUpdate = state.products.find(
        (p) => p.productVariantId === variantId,
      );
      if (!itemToUpdate) return state;

      const updatedProducts: CartItemType[] = state.products.map((p) =>
        p.productVariantId === variantId ? { ...p, quantity } : p,
      );

      return {
        products: updatedProducts,
        totalItems: state.totalItems - itemToUpdate.quantity + quantity,
        totalPrice:
          state.totalPrice -
          itemToUpdate.priceAtPurchase * itemToUpdate.quantity +
          itemToUpdate.priceAtPurchase * quantity,
      };
    });
  },
  clearCart: () => set(INITIAL_STATE),
}));
