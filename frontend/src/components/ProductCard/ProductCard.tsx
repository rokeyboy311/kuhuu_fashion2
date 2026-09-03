import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, MessageCircle } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { generateWhatsAppOrderUrl } from '@/data/productsData';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category?: string;
  categoryName?: string;
  image?: string;
  images?: Array<{ id: string; alt?: string; isPrimary: boolean } | string>;
  variants?: Array<{ id: string; price: number; compareAtPrice?: number; stock: number; size?: string; color?: string }>;
  basePrice?: number;
  compareAtPrice?: number;
  averageRating?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  categoryName,
  image,
  images = [],
  variants = [],
  basePrice,
  compareAtPrice,
  averageRating,
  rating,
  reviewCount = 0,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.addItem);

  // Determine Image URL
  let displayImage = image;
  if (!displayImage && images.length > 0) {
    const first = images[0];
    displayImage = typeof first === 'string' ? first : `/api/v1/images/${first.id}/thumb`;
  }
  if (!displayImage) {
    displayImage = '/assets/images/black_kundan_gown.jpg';
  }

  // Determine Secondary Image for hover
  let secondaryImage = '';
  if (images.length > 1) {
    const second = images[1];
    secondaryImage = typeof second === 'string' ? second : `/api/v1/images/${second.id}/thumb`;
  }

  // Price calculations
  let currentPrice = basePrice;
  let originalPrice = compareAtPrice;
  if (!currentPrice && variants.length > 0) {
    currentPrice = Math.min(...variants.map((v) => v.price));
    originalPrice = Math.max(...variants.map((v) => v.compareAtPrice || 0));
  }
  currentPrice = currentPrice || 4999;
  const hasDiscount = Boolean(originalPrice && originalPrice > currentPrice);
  const discountPct = (hasDiscount && originalPrice) ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const finalRating = rating || averageRating || 4.9;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variantId = variants[0]?.id || `var-${id}`;
    addToCart(id, variantId, 1);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(generateWhatsAppOrderUrl(name, 'Standard', currentPrice), '_blank');
  };

  return (
    <div className="group relative bg-white border border-[#EBE7DF] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between" id={`product-card-${id}`}>
      {/* Media Box */}
      <Link to={`/product/${slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#F7F5F0]">
        <img
          src={displayImage}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${secondaryImage ? 'group-hover:opacity-0' : ''}`}
          loading="lazy"
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${name} detail`}
            className="w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100 absolute inset-0 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#0E0E0E] text-[#C9A96E] border border-[#C9A96E]/30">
              New In
            </span>
          )}
          {isBestSeller && !isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C9A96E] text-[#0E0E0E]">
              Bestseller
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-red-600 text-white">
              {discountPct}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          type="button"
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            isWishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Action Overlay on Desktop Hover */}
        <div className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            type="button"
            className="flex-1 py-2.5 px-3 bg-[#0E0E0E] text-[#F5F2EB] text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#222] transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag size={14} />
            Quick Bag
          </button>
          <button
            onClick={handleWhatsApp}
            type="button"
            aria-label="Order on WhatsApp"
            className="w-10 h-10 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
            title="Inquire / Order on WhatsApp"
          >
            <MessageCircle size={17} />
          </button>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {categoryName && (
            <span className="text-[11px] font-medium tracking-widest text-[#947A46] uppercase block mb-1">
              {categoryName}
            </span>
          )}
          <Link to={`/product/${slug}`} className="block">
            <h3 className="font-serif text-sm font-medium text-neutral-900 group-hover:text-[#947A46] transition-colors line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-neutral-900">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span className="font-medium">{finalRating.toFixed(1)}</span>
            {reviewCount > 0 && <span className="text-neutral-400">({reviewCount})</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
