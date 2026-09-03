import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, MessageCircle, Lock, ArrowLeft, CheckCircle2, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS, STORE_INFO } from '@/data/productsData';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    notes: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'store'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive cart items with full product details
  const displayItems = cartItems.length > 0 ? cartItems.map((item) => {
    const p = PRODUCTS.find((prod) => prod.id === item.productId) || PRODUCTS[0];
    return {
      ...item,
      product: p,
      price: p.basePrice,
      name: p.name,
      image: p.image,
    };
  }) : [
    // Fallback item so the user can test the checkout immediately
    {
      productId: PRODUCTS[0].id,
      variantId: 'var-standard',
      quantity: 1,
      product: PRODUCTS[0],
      price: PRODUCTS[0].basePrice,
      name: PRODUCTS[0].name,
      image: PRODUCTS[0].image,
    }
  ];

  const subtotal = displayItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'store' || subtotal >= 1999 ? 0 : 149;
  const codFee = paymentMethod === 'cod' ? 99 : 0;
  const total = Math.max(0, subtotal - discount + shippingFee + codFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'KUHUU10') {
      const discountAmount = Math.round(subtotal * 0.1);
      setDiscount(discountAmount);
      toast.success('Coupon KUHUU10 applied! (10% Off)');
    } else if (coupon.trim().toUpperCase() === 'FESTIVE') {
      setDiscount(500);
      toast.success('Festive discount of ₹500 applied!');
    } else {
      toast.error('Invalid coupon code. Try "KUHUU10"');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.address) {
      toast.error('Please enter required shipping information');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      const orderId = 'KF-' + Math.floor(100000 + Math.random() * 900000);
      navigate(`/order-success?orderId=${orderId}&total=${total}`);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="container-site max-w-6xl">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EBE7DF]">
          <Link to="/shop" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900">
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#947A46]">
            <Lock size={14} />
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Columns: Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Customer & Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <h2 className="font-serif text-xl text-neutral-900 font-normal mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0E0E0E] text-[#C9A96E] text-xs font-bold flex items-center justify-center">1</span>
                  Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Pooja"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Patel"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Phone Number (For WhatsApp Updates) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98790 00000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House/Flat No, Apartment, Street"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">State & Pincode *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-2/3 px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="w-1/3 px-3.5 py-2.5 rounded-lg border border-[#EBE7DF] text-xs focus:border-[#C9A96E] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Option */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <h2 className="font-serif text-xl text-neutral-900 font-normal mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0E0E0E] text-[#C9A96E] text-xs font-bold flex items-center justify-center">2</span>
                  Delivery Method
                </h2>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('courier')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === 'courier' ? 'border-[#0E0E0E] bg-[#F7F5F0]' : 'border-[#EBE7DF] bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input type="radio" checked={deliveryMethod === 'courier'} readOnly className="mt-1 accent-black" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">Pan-India Insured Express Courier</span>
                        <span className="text-[11px] text-neutral-500">Delivered within 2–4 business days with live SMS tracking</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">{subtotal >= 1999 ? 'FREE' : '₹149'}</span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('store')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      deliveryMethod === 'store' ? 'border-[#0E0E0E] bg-[#F7F5F0]' : 'border-[#EBE7DF] bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input type="radio" checked={deliveryMethod === 'store'} readOnly className="mt-1 accent-black" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">Surat Flagship Store Trial & Pickup</span>
                        <span className="text-[11px] text-neutral-500">Shop No. 114, Classic Complex, Ghod Dod Road, Parle Point</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-600">FREE</span>
                  </label>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE7DF] shadow-sm">
                <h2 className="font-serif text-xl text-neutral-900 font-normal mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0E0E0E] text-[#C9A96E] text-xs font-bold flex items-center justify-center">3</span>
                  Payment Preference
                </h2>

                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-[#0E0E0E] bg-[#F7F5F0]' : 'border-[#EBE7DF] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'upi'} readOnly className="accent-black" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">UPI Instant (Google Pay, PhonePe, Paytm, QR)</span>
                        <span className="text-[11px] text-neutral-500">Instant verification & faster dispatch</span>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-semibold">Recommended</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#0E0E0E] bg-[#F7F5F0]' : 'border-[#EBE7DF] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-black" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">Credit / Debit Card & Net Banking</span>
                        <span className="text-[11px] text-neutral-500">All major Indian and international cards accepted</span>
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-[#0E0E0E] bg-[#F7F5F0]' : 'border-[#EBE7DF] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-black" />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-neutral-500">Pay cash upon parcel delivery (+₹99 handling)</span>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-600 font-medium">+₹99</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE7DF] shadow-lg sticky top-24">
                <h3 className="font-serif text-lg text-neutral-900 font-medium pb-4 border-b border-[#EBE7DF]">
                  Order Summary ({displayItems.length} outfit{displayItems.length > 1 ? 's' : ''})
                </h3>

                {/* Items List */}
                <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto py-2">
                  {displayItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-lg border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif text-neutral-900 font-medium truncate">{item.name}</h4>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                        <span className="text-xs font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Input */}
                <div className="pt-4 border-t border-[#EBE7DF]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon: KUHUU10"
                      className="flex-1 px-3 py-2 border border-[#EBE7DF] rounded-lg text-xs uppercase tracking-wider focus:outline-none focus:border-[#C9A96E]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Pricing Calculation */}
                <div className="pt-4 border-t border-[#EBE7DF] space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount Coupon</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>COD Handling</span>
                      <span>₹{codFee}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-base font-bold text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#947A46]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 bg-[#0E0E0E] hover:bg-[#222] text-[#C9A96E] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Lock size={15} />
                  <span>{isProcessing ? 'Processing Secure Order...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}</span>
                </button>

                {/* WhatsApp alternative */}
                <div className="mt-4 text-center">
                  <a
                    href={`https://wa.me/919879012345?text=${encodeURIComponent(
                      `Hello Kuhuu Fashion! I would like to place an order for items totaling ₹${total.toLocaleString('en-IN')}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-semibold hover:underline"
                  >
                    <MessageCircle size={15} />
                    <span>Prefer to book directly via WhatsApp? Tap here</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
