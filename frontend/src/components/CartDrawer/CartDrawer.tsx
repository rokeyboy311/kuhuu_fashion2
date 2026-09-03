import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { getProductThumbnailUrl, PLACEHOLDER_IMAGE } from '@/utils/imageUrl';
import { PRODUCTS, generateWhatsAppOrderUrl } from '@/data/productsData';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const subTotal = subtotal();
  const count = itemCount();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const freeShippingThreshold = 1999;
  const remaining = Math.max(0, freeShippingThreshold - subTotal);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeCart} />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 max-w-full bg-white shadow-2xl flex flex-col justify-between"
        id="cart-drawer"
        role="dialog"
        aria-label="Shopping bag"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EBE7DF]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-[#947A46]" />
            <span className="font-serif font-bold text-base tracking-wider uppercase text-neutral-900">
              Shopping Bag
            </span>
            {count > 0 && (
              <span className="bg-[#0E0E0E] text-[#C9A96E] rounded-full px-2 py-0.5 text-[11px] font-bold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
            id="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subTotal > 0 && (
          <div className="px-5 py-3 bg-[#F7F5F0] border-b border-[#EBE7DF]">
            {remaining === 0 ? (
              <p className="text-xs text-green-700 font-semibold">
                ✓ You've unlocked FREE Pan-India Express Delivery!
              </p>
            ) : (
              <p className="text-xs text-neutral-600">
                Add ₹{remaining.toLocaleString('en-IN')} more for <strong>FREE shipping</strong>
              </p>
            )}
            <div className="h-1.5 bg-[#EBE7DF] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#947A46] transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (subTotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-neutral-200 mb-4" />
              <h4 className="font-serif text-lg text-neutral-900 mb-1">Your Bag is Empty</h4>
              <p className="text-xs text-neutral-500 mb-6 max-w-xs mx-auto">
                Explore our viral Instagram looks, wedding drapes, and bespoke Surat craftsmanship.
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                onClick={closeCart}
                id="cart-empty-shop-btn"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                // Find matching product in local catalog or fallback
                const fallbackProd = PRODUCTS.find((p) => p.id === item.productId) || PRODUCTS[0];
                const product: any = item.product || fallbackProd;

                // Resolve image safely
                let imgUrl = product.image || '/assets/images/black_kundan_gown.jpg';
                if (product.images && product.images.length > 0) {
                  const first = product.images[0];
                  imgUrl = typeof first === 'string' ? first : getProductThumbnailUrl(first.id);
                }

                const price = item.variant?.price || product.basePrice || 4999;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5" id={`cart-item-${item.id}`}>
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="w-16 h-20 bg-[#F7F5F0] rounded-lg overflow-hidden shrink-0 border border-neutral-200 block"
                    >
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="font-serif text-xs font-medium text-neutral-900 hover:text-[#947A46] line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Size: {item.variant?.size || 'Standard'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                            id={`qty-minus-${item.id}`}
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                            id={`qty-plus-${item.id}`}
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">
                            ₹{(price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 p-1"
                            title="Remove item"
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

        {/* Footer Checkout Bar */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#EBE7DF] bg-[#FAF8F5] space-y-3">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-neutral-500">Estimated Total:</span>
              <span className="text-base font-serif font-bold text-neutral-900">
                ₹{subTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Taxes calculated at checkout. Express delivery available.</p>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-[#0E0E0E] hover:bg-[#222] text-[#C9A96E] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
              id="cart-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            <a
              href={`https://wa.me/919879012345?text=${encodeURIComponent(
                `Hello Kuhuu Fashion! I have ${items.length} items in my cart totaling ₹${subTotal.toLocaleString(
                  'en-IN'
                )}. Can I order directly?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={15} />
              <span>Checkout via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
