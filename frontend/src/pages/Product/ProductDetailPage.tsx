import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Share2, Star, ChevronDown, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react';
import api from '@/services/api';
import { getProductImageUrl, getProductThumbnailUrl, PLACEHOLDER_IMAGE } from '@/utils/imageUrl';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard/ProductCard';
import toast from 'react-hot-toast';

type Variant = {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
};

type ProductImage = {
  id: string;
  alt?: string;
  isPrimary: boolean;
  width: number;
  height: number;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });

  const { data: relatedData } = useQuery({
    queryKey: ['related', slug],
    queryFn: () => api.get(`/products/${slug}/related`).then((r) => r.data.data),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container-site" style={{ padding: '3rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton" style={{ aspectRatio: '3/4' }} />
          <div>
            <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '1.5rem', width: '30%', marginBottom: '2rem' }} />
            <div className="skeleton" style={{ height: '120px', marginBottom: '1.5rem' }} />
            <div className="skeleton" style={{ height: '3rem' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 1rem' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Shop</Link>
      </div>
    );
  }

  const product = data;
  const images: ProductImage[] = product.images || [];
  const variants: Variant[] = product.variants || [];

  // Distinct sizes and colors
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Map(variants.filter((v) => v.color).map((v) => [v.color, v])).values()];

  // Find the selected variant
  const selectedVariant = variants.find(
    (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
  ) || variants[0];

  const currentPrice = selectedVariant?.price || 0;
  const comparePrice = selectedVariant?.compareAtPrice || 0;
  const hasDiscount = comparePrice > currentPrice;
  const discountPct = hasDiscount ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;
  const inStock = (selectedVariant?.stock || 0) > 0;
  const mainImageId = activeImageId || images[0]?.id;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${slug}`);
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedVariant) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, selectedVariant.id, qty);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const relatedProducts = relatedData?.products || relatedData || [];

  return (
    <>
      <div className="container-site" style={{ padding: '2rem 0 4rem' }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: '2rem' }}>
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/shop">Shop</Link>
          {product.category && (
            <>
              <span className="sep">/</span>
              <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
            </>
          )}
          <span className="sep">/</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
          {/* ── Images ── */}
          <div>
            {/* Main image */}
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--color-surface-muted)', marginBottom: '0.75rem' }}>
              <img
                src={mainImageId ? getProductImageUrl(mainImageId) : PLACEHOLDER_IMAGE}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                id="product-main-image"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }} className="no-scrollbar">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageId(img.id)}
                    id={`thumb-${img.id}`}
                    style={{
                      flexShrink: 0,
                      width: '64px',
                      height: '80px',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: activeImageId === img.id ? 'var(--color-brand)' : 'transparent',
                      cursor: 'pointer',
                      background: 'var(--color-surface-muted)',
                    }}
                  >
                    <img
                      src={getProductThumbnailUrl(img.id)}
                      alt={img.alt || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div style={{ position: 'sticky', top: '5rem' }}>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem' }}>
              {product.isNew && <span className="badge badge-new">New</span>}
              {product.isBestSeller && <span className="badge badge-bestseller">Best Seller</span>}
              {hasDiscount && <span className="badge badge-sale">{discountPct}% OFF</span>}
            </div>

            {/* Name */}
            <h1
              className="text-display"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: '0.03em', marginBottom: '0.5rem', lineHeight: 1.2 }}
              id="product-name"
            >
              {product.name}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                by {product.brand}
              </p>
            )}

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      style={{ fill: s <= Math.round(product.averageRating || 0) ? '#c9a96e' : 'none', stroke: '#c9a96e' }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {product.averageRating?.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }} id="product-price">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                    ₹{comparePrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-error)', fontWeight: 600 }}>
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '-1.5rem', marginBottom: '1.5rem' }}>
              Inclusive of all taxes
            </p>

            {/* Color selector */}
            {colors.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <p className="label">Color: <span style={{ textTransform: 'none', fontWeight: 400 }}>{selectedColor || 'Select'}</span></p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {colors.map((v) => (
                    <button
                      key={v.color}
                      className={`color-swatch ${selectedColor === v.color ? 'selected' : ''}`}
                      style={{ background: v.colorHex || '#ccc' }}
                      onClick={() => setSelectedColor(v.color || null)}
                      title={v.color}
                      id={`color-${v.color}`}
                      aria-label={`Color: ${v.color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                  <p className="label" style={{ marginBottom: 0 }}>
                    Size: <span style={{ textTransform: 'none', fontWeight: 400 }}>{selectedSize || 'Select'}</span>
                  </p>
                  <button
                    style={{ fontSize: '0.7rem', textDecoration: 'underline', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                    id="size-guide-btn"
                  >
                    Size Guide
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {sizes.map((s) => {
                    const v = variants.find((va) => va.size === s && (!selectedColor || va.color === selectedColor));
                    const oos = !v || v.stock === 0;
                    return (
                      <button
                        key={s}
                        className={`size-btn ${selectedSize === s ? 'selected' : ''} ${oos ? 'out-of-stock' : ''}`}
                        onClick={() => !oos && setSelectedSize(selectedSize === s ? null : s)}
                        id={`size-${s}`}
                        disabled={oos}
                        aria-label={`Size ${s}${oos ? ' (out of stock)' : ''}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock info */}
            {selectedVariant && (
              <p style={{ fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                {inStock ? (
                  <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                    ✓ In Stock
                    {selectedVariant.stock <= 10 && selectedVariant.stock > 0 && (
                      <span style={{ color: 'var(--color-warning)', marginLeft: '0.5rem' }}>
                        • Only {selectedVariant.stock} left
                      </span>
                    )}
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>✗ Out of Stock</span>
                )}
              </p>
            )}

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="qty-stepper" id="quantity-stepper">
                <button onClick={() => setQty(Math.max(1, qty - 1))} id="qty-minus">−</button>
                <input
                  type="number"
                  value={qty}
                  min={1}
                  max={selectedVariant?.stock || 1}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  id="qty-input"
                  readOnly
                />
                <button
                  onClick={() => setQty(Math.min(selectedVariant?.stock || 99, qty + 1))}
                  id="qty-plus"
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-primary ${addingToCart ? 'btn-loading' : ''}`}
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                id="add-to-cart-btn"
              >
                <ShoppingBag size={15} />
                {addingToCart ? 'Adding...' : inStock ? 'Add to Bag' : 'Out of Stock'}
              </button>
            </div>

            {/* Wishlist + Share */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  if (!isAuthenticated) { navigate('/login'); return; }
                  toggleWishlist(product.id);
                }}
                id="wishlist-btn"
              >
                <Heart size={15} style={{ fill: wishlisted ? '#c0392b' : 'none', stroke: wishlisted ? '#c0392b' : 'currentColor' }} />
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleShare}
                id="share-btn"
                style={{ paddingInline: '1rem' }}
              >
                <Share2 size={15} />
              </button>
            </div>

            {/* Delivery info */}
            <div style={{ border: '1px solid var(--color-border)', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
                <Truck size={16} style={{ flexShrink: 0, color: 'var(--color-text-muted)', marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.2rem' }}>Free Shipping on orders above ₹999</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Estimated delivery: 3–7 business days</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.875rem' }}>
                <RotateCcw size={16} style={{ flexShrink: 0, color: 'var(--color-text-muted)', marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.2rem' }}>7-Day Easy Returns</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>No questions asked</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Shield size={16} style={{ flexShrink: 0, color: 'var(--color-text-muted)', marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.2rem' }}>Secure Payments</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>UPI, Cards, Net Banking, COD</p>
                </div>
              </div>
            </div>

            {/* Expandable sections */}
            {[
              { key: 'description', label: 'Description', content: product.description },
              { key: 'fabric', label: 'Fabric & Care', content: [product.fabricDetails, product.careInstructions].filter(Boolean).join('\n') },
              { key: 'returns', label: 'Returns & Exchanges', content: 'We accept returns within 7 days of delivery. Items must be unworn, unwashed and in original packaging.\n\nFor exchange requests, please contact us on WhatsApp or email within 7 days.' },
            ].filter((s) => s.content).map((section) => (
              <div key={section.key} style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleSection(section.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                  id={`expand-${section.key}`}
                >
                  {section.label}
                  <ChevronDown
                    size={14}
                    style={{ transform: expandedSection === section.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </button>
                {expandedSection === section.key && (
                  <div style={{ paddingBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews section */}
        {product.reviews && product.reviews.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 className="text-display" style={{ fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Customer Reviews
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {product.reviews.map((review: { id: string; rating: number; title?: string; content: string; createdAt: string; user: { firstName: string; lastName: string; avatar?: string } }) => (
                <div key={review.id} style={{ border: '1px solid var(--color-border)', padding: '1.25rem' }} id={`review-${review.id}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div className="stars">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} style={{ fill: s <= review.rating ? '#c9a96e' : 'none', stroke: '#c9a96e' }} />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem' }}>{review.title}</p>
                  )}
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {review.content}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    — {review.user.firstName} {review.user.lastName[0]}.
                    <span style={{ marginLeft: '0.5rem' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <div className="section-heading" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h2 style={{ textAlign: 'left', fontSize: '1.5rem' }}>You May Also Like</h2>
              <div className="divider" style={{ margin: '0.75rem 0 0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.slice(0, 6).map((p: {
                id: string;
                name: string;
                slug: string;
                images: ProductImage[];
                variants: Variant[];
                averageRating?: number;
                reviewCount?: number;
                isNew?: boolean;
              }) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
