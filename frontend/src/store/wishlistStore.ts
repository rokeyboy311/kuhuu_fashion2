import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

interface WishlistState {
  productIds: Set<string>;
  isLoading: boolean;

  isWishlisted: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: new Set<string>(),
      isLoading: false,

      isWishlisted: (productId) => get().productIds.has(productId),

      fetchWishlist: async () => {
        try {
          const { data } = await api.get('/wishlist');
          const ids = new Set<string>(
            data.data.map((item: { productId: string }) => item.productId)
          );
          set({ productIds: ids });
        } catch {}
      },

      toggle: async (productId) => {
        const wishlisted = get().isWishlisted(productId);
        // Optimistic update
        set((state) => {
          const next = new Set(state.productIds);
          if (wishlisted) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return { productIds: next };
        });

        try {
          await api.post('/wishlist/toggle', { productId });
          toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch {
          // Revert
          set((state) => {
            const next = new Set(state.productIds);
            if (wishlisted) {
              next.add(productId);
            } else {
              next.delete(productId);
            }
            return { productIds: next };
          });
          toast.error('Failed to update wishlist');
        }
      },
    }),
    {
      name: 'kuhuu-wishlist',
      partialize: (state) => ({
        productIds: Array.from(state.productIds) as unknown as Set<string>,
      }),
      merge: (persisted, current) => ({
        ...current,
        productIds: new Set(
          persisted ? (persisted as { productIds: string[] }).productIds : []
        ),
      }),
    }
  )
);
