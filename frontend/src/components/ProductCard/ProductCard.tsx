import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { getProductThumbnailUrl, PLACEHOLDER_IMAGE } from '@/utils/imageUrl';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface ProductImage {
  id: string;
  alt?: string;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  size?: string;
  color?: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  images,
  variants,
  averageRating = 0,
  reviewCount = 0,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.addItem);

  const primaryImage = images.find((i) => i.isPrimary) || images[0];
  const lowestPrice = Math.min(...variants.map((v) => v.price));
  const highestCompare = Math.max(...variants.map((v) => v.compareAtPrice || 0));
  const hasDiscount = highestCompare > lowestPrice;
  const discountPct = hasDiscount ? Math.round(((highestCompare - lowestPrice) / highestCompare) * 100) : 0;
  const inStock = variants.some((v) => v.stock > 0);

  // Cheapest in-stock variant for quick add
  const defaultVariant = variants.find((v) => v.stock > 0);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
      return;
    }
    toggleWishlist(id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/shop`);
      return;
    }
    if (!defaultVariant) return;
    addToCart(id, defaultVariant.id, 1);
  };

  return (
    <Link to={`/product/${slug}`} className="product-card block" id={`product-card-${id}`}>
      {/* Image */}
      <div className="product-image-wrap">
        <img
          src={primaryImage ? getProductThumbnailUrl(primaryImage.id) : PLACEHOLDER_IMAGE}
          alt={primaryImage?.alt || name}
          loading="lazy"
        />

        {/* Badge */}
        {isNew && <span className="product-badge badge badge-new">New</span>}
        {!isNew && isBestSeller && <span className="product-badge badge badge-bestseller">Best Seller</span>}
        {hasDiscount && !isNew && !isBestSeller && (
          <span className="product-badge badge badge-sale">{discountPct}% OFF</span>
        )}
        {!inStock && (
          <span className="product-badge badge badge-oos" style={{ left: 'auto', right: '0.75rem' }}>
            Sold Out
          </span>
        )}

        {/* Wishlist button */}
        <button
          className="product-wishlist"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-btn-${id}`}
        >
          <Heart
            size={15}
            style={{ fill: isWishlisted ? '#c0392b' : 'none', stroke: isWishlisted ? '#c0392b' : '#1a1a1a' }}
          />
        </button>

        {/* Quick add */}
        {inStock && (
          <button className="quick-add" onClick={handleQuickAdd} id={`quick-add-${id}`}>
            <ShoppingBag size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
            Quick Add
          </button>
        )}
      </div>

      {/* Product info */}
      <div className="product-info">
        <p className="product-name">{name}</p>

        <div className="product-price">
          <span className="price-current">₹{lowestPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <>
              <span className="price-original">₹{highestCompare.toLocaleString('en-IN')}</span>
              <span className="price-discount">{discountPct}% off</span>
            </>
          )}
        </div>

        {reviewCount > 0 && (
          <div className="stars" style={{ gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                style={{
                  fill: s <= Math.round(averageRating) ? '#c9a96e' : 'none',
                  stroke: '#c9a96e',
                }}
              />
            ))}
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '3px' }}>
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Size pills */}
        {variants.length > 0 && variants[0].size && (
          <div style={{ display: 'flex', gap: '3px', marginTop: '0.375rem', flexWrap: 'wrap' }}>
            {[...new Set(variants.map((v) => v.size).filter(Boolean))].slice(0, 5).map((size) => {
              const v = variants.find((va) => va.size === size);
              return (
                <span
                  key={size}
                  style={{
                    fontSize: '0.6rem',
                    color: v?.stock === 0 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                    textDecoration: v?.stock === 0 ? 'line-through' : 'none',
                  }}
                >
                  {size}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
