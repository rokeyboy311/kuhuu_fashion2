import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface CartVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  images: Array<{ id: string; alt?: string; isPrimary: boolean }>;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: CartProduct;
  variant: CartVariant;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Computed
  itemCount: () => number;
  subtotal: () => number;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      fetchCart: async () => {
        try {
          const { data } = await api.get('/cart');
          set({ items: data.data.items || [] });
        } catch {}
      },

      addItem: async (productId, variantId, quantity = 1) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/cart', { productId, variantId, quantity });
          await get().fetchCart();
          set({ isOpen: true });
          toast.success('Added to bag');
        } catch (error: unknown) {
          const msg =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to add to bag';
          toast.error(msg);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        try {
          await api.put(`/cart/${itemId}`, { quantity });
          await get().fetchCart();
        } catch {
          toast.error('Failed to update quantity');
        }
      },

      removeItem: async (itemId) => {
        try {
          await api.delete(`/cart/${itemId}`);
          set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }));
          toast.success('Removed from bag');
        } catch {
          toast.error('Failed to remove item');
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart/clear');
          set({ items: [] });
        } catch {}
      },
    }),
    {
      name: 'kuhuu-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
