import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '@/store/wishlistStore';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/productsData';

export default function WishlistPage() {
  const wishlistedIds = useWishlistStore((s) => Array.from(s.productIds));

  // Try API query if backend is online
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((r) => r.data.data),
    retry: false,
  });

  // Local fallback items matching wishlisted IDs or default favorites if empty
  const localWishlistItems = wishlistedIds.length > 0
    ? PRODUCTS.filter((p) => wishlistedIds.includes(p.id))
    : [];

  const displayProducts = (apiData && apiData.length > 0)
    ? apiData.map((item: { product: Parameters<typeof ProductCard>[0] }) => item.product)
    : localWishlistItems;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      {/* Header Banner */}
      <div className="bg-[#0E0E0E] text-white py-12 mb-10 border-b border-[#C9A96E]/20 text-center">
        <div className="container-site">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium block mb-2">
            Your Private Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm">
            {displayProducts.length} saved creation{displayProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container-site">
        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EBE7DF] p-16 text-center max-w-xl mx-auto shadow-sm">
            <Heart size={48} className="mx-auto text-neutral-200 mb-4" />
            <h3 className="font-serif text-xl text-neutral-900 mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-neutral-500 mb-6 max-w-sm mx-auto">
              Save your favourite cocktail drapes, bridal lehengas, and viral Instagram outfits to view them later.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors"
              id="empty-wishlist-shop-btn"
            >
              <span>Explore Collections</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((prod: any) => (
              <ProductCard key={prod.id} {...prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
