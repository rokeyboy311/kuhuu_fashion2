import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { getProductThumbnailUrl, PLACEHOLDER_IMAGE } from '@/utils/imageUrl';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount, updateQuantity, removeItem, isLoading } = useCartStore();
  const subTotal = subtotal();
  const count = itemCount();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const freeShippingThreshold = 999;
  const remaining = Math.max(0, freeShippingThreshold - subTotal);

  return (
    <>
      {/* Overlay */}
      <div className="cart-drawer-overlay" onClick={closeCart} />

      {/* Drawer */}
      <div className="cart-drawer" id="cart-drawer" role="dialog" aria-label="Shopping bag">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <ShoppingBag size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Your Bag
            </span>
            {count > 0 && (
              <span
                style={{ background: 'var(--color-brand)', color: '#fff', borderRadius: '999px', padding: '0 7px', fontSize: '0.65rem', fontWeight: 700, lineHeight: '18px' }}
              >
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="header-icon-btn" id="cart-close-btn" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Free shipping progress */}
        {subTotal > 0 && (
          <div style={{ padding: '0.875rem 1.5rem', background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)' }}>
            {remaining === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                ✓ You've unlocked free shipping!
              </p>
            ) : (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Add ₹{remaining.toLocaleString('en-IN')} more for <strong>free shipping</strong>
              </p>
            )}
            <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: '2px', marginTop: '0.5rem' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: remaining === 0 ? 'var(--color-success)' : 'var(--color-brand)',
                  width: `${Math.min(100, (subTotal / freeShippingThreshold) * 100)}%`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.15 }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Your bag is empty
              </p>
              <Link to="/shop" className="btn btn-primary btn-sm" onClick={closeCart} id="cart-empty-shop-btn">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => {
                const img = item.product.images.find((i) => i.isPrimary) || item.product.images[0];
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '0.875rem' }} id={`cart-item-${item.id}`}>
                    {/* Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      style={{ flexShrink: 0, width: '72px', height: '90px', background: 'var(--color-surface-muted)', overflow: 'hidden' }}
                    >
                      <img
                        src={img ? getProductThumbnailUrl(img.id) : PLACEHOLDER_IMAGE}
                        alt={img?.alt || item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        style={{ fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.4, display: 'block', marginBottom: '0.25rem' }}
                      >
                        {item.product.name}
                      </Link>
                      {(item.variant.color || item.variant.size) && (
                        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                          {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer' }}
                            id={`qty-minus-${item.id}`}
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 500 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer' }}
                            id={`qty-plus-${item.id}`}
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            id={`remove-item-${item.id}`}
                            aria-label="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', background: '#fff' }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                ₹{subTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Shipping</span>
              <span style={{ fontSize: '0.8rem', color: remaining === 0 ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                {remaining === 0 ? 'FREE' : '₹50'}
              </span>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary btn-full"
              onClick={closeCart}
              id="cart-checkout-btn"
              style={{ fontSize: '0.75rem', letterSpacing: '0.12em', marginBottom: '0.625rem' }}
            >
              Proceed to Checkout • ₹{(subTotal + (remaining > 0 ? 50 : 0)).toLocaleString('en-IN')}
            </Link>
            <Link
              to="/shop"
              className="btn btn-ghost btn-full btn-sm"
              onClick={closeCart}
              id="cart-continue-shopping-btn"
              style={{ fontSize: '0.7rem' }}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
