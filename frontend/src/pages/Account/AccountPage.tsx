import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, MapPin, Heart, Scissors, MessageCircle, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { STORE_INFO, PRODUCTS } from '@/data/productsData';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'measurements' | 'addresses'>('orders');

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="container-site max-w-5xl">
        {/* Header Profile Bar */}
        <div className="bg-[#0E0E0E] text-white p-8 rounded-2xl mb-8 border border-[#C9A96E]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C9A96E] to-[#F5F2EB] flex items-center justify-center text-black font-serif font-bold text-2xl shadow-md">
              {user?.firstName?.[0] || 'K'}
            </div>
            <div>
              <span className="text-[11px] text-[#C9A96E] uppercase font-bold tracking-widest block">
                Couture Circle Patron
              </span>
              <h1 className="font-serif text-2xl text-white font-normal">
                {user ? `${user.firstName} ${user.lastName || ''}` : 'Kuhuu Patron'}
              </h1>
              <p className="text-xs text-neutral-400">
                {user?.email || 'patron@kuhuufashion.com'} • Surat, India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageCircle size={14} className="text-[#25D366]" />
              <span>Personal Stylist</span>
            </a>
            <button
              onClick={() => logout()}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EBE7DF] mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#0E0E0E] text-[#0E0E0E]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package size={16} />
            <span>My Orders & Tailoring</span>
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'measurements'
                ? 'border-[#0E0E0E] text-[#0E0E0E]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Scissors size={16} />
            <span>Bespoke Measurements</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#0E0E0E] text-[#0E0E0E]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <MapPin size={16} />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Active Order Card */}
            <div className="bg-white rounded-2xl border border-[#EBE7DF] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-100 gap-2">
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block">Order #KF-928412</span>
                  <span className="text-xs text-neutral-400">Placed on September 2, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Hand-Finishing at Surat Atelier
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={PRODUCTS[0].image}
                    alt={PRODUCTS[0].name}
                    className="w-16 h-20 object-cover rounded-lg border border-neutral-200"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-medium text-neutral-900">{PRODUCTS[0].name}</h4>
                    <p className="text-xs text-neutral-500">Size: Custom Stitched • Qty: 1</p>
                    <span className="text-xs font-bold text-neutral-900">₹{PRODUCTS[0].basePrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/919879012345?text=Hi%20Kuhuu%20Fashion%2C%20please%20share%20status%20for%20Order%20KF-928412`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-lg text-center"
                  >
                    Track on WhatsApp
                  </a>
                  <Link
                    to={`/product/${PRODUCTS[0].slug}`}
                    className="flex-1 sm:flex-none px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg text-center"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bespoke Measurements */}
        {activeTab === 'measurements' && (
          <div className="bg-white rounded-2xl border border-[#EBE7DF] p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif text-lg text-neutral-900 font-normal mb-2">Saved Atelier Measurements</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Our Surat master tailors use these exact dimensions when you select "Custom Stitched" at checkout.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EBE7DF]">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Bust / Chest</span>
                <span className="font-mono text-base font-bold text-neutral-900">36 inches</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EBE7DF]">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Waist</span>
                <span className="font-mono text-base font-bold text-neutral-900">30 inches</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EBE7DF]">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Hip</span>
                <span className="font-mono text-base font-bold text-neutral-900">39 inches</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#EBE7DF]">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Shoulder to Floor</span>
                <span className="font-mono text-base font-bold text-neutral-900">55 inches</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <span>Need to alter your measurements? Send updated details directly to our tailoring team.</span>
              <a
                href="https://wa.me/919879012345?text=Hello%2C%20I%20want%20to%20update%20my%20stitching%20measurements"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline ml-2 whitespace-nowrap"
              >
                WhatsApp Tailor →
              </a>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#0E0E0E] p-6 relative shadow-sm">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#0E0E0E] text-[#C9A96E] text-[10px] uppercase tracking-widest font-bold">
                Default Primary
              </span>
              <h4 className="font-serif text-base font-medium text-neutral-900 mb-2">Home (Surat Residence)</h4>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                14, Shivalik Bungalows, Near Parle Point,<br />
                Athwa, Surat, Gujarat – 395007<br />
                Phone: +91 98790 12345
              </p>
              <button className="text-xs text-[#947A46] font-semibold uppercase tracking-wider hover:underline">
                Edit Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
