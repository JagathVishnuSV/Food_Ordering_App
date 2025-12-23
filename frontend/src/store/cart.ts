import { create } from 'zustand';
import type { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.quantity, 0);
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.name === item.name);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  
  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter((i) => i.name !== name),
    })),
  
  updateQuantity: (name, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.name === name ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0),
    })),
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => calculateTotal(get().items),
}));
