import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MessageCircle, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { STORE_INFO } from '@/data/productsData';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'KF-' + Math.floor(100000 + Math.random() * 900000);
  const total = searchParams.get('total') || '8,499';

  const whatsappMessage = `Hello Kuhuu Fashion! 👋\nI just placed order *${orderId}* on your website for ₹${total}.\nCould you please confirm receipt and share the tracking updates?`;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16">
      <div className="container-site max-w-2xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EBE7DF] shadow-xl text-center">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={44} />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#947A46] font-bold block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal mb-3">
            Thank You for Choosing Kuhuu Fashion
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8">
            Your couture outfit is being prepared with immense love and artisan care at our Surat atelier.
          </p>

          {/* Order Details Card */}
          <div className="p-6 rounded-2xl bg-[#F7F5F0] border border-[#EBE7DF] text-left space-y-4 mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider">Order Reference</span>
              <span className="font-mono font-bold text-sm text-neutral-900">{orderId}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider">Total Paid</span>
              <span className="font-bold text-base text-[#947A46]">₹{Number(total).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                <Calendar size={14} /> Estimated Delivery
              </span>
              <span className="text-xs font-semibold text-neutral-800">3 to 5 Business Days</span>
            </div>

            <div className="flex items-start justify-between pt-1">
              <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                <MapPin size={14} /> Atelier Origin
              </span>
              <span className="text-xs text-neutral-700 text-right max-w-xs">{STORE_INFO.address}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/919879012345?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              <span>Get WhatsApp Live Dispatch Updates</span>
            </a>

            <Link
              to="/shop"
              className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore More Creations</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
