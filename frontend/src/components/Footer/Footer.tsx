import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import InstagramIcon from '@/components/Icons/InstagramIcon';
import { STORE_INFO, CATEGORIES } from '@/data/productsData';

const SHOP_LINKS = [
  { label: 'All Collections', to: '/shop' },
  { label: 'Festive Edit', to: '/shop?category=festive-edit' },
  { label: 'Ethnic Wear', to: '/shop?category=ethnic-wear' },
  { label: 'Indo-Western', to: '/shop?category=indo-western' },
  { label: 'Dresses & Drapes', to: '/shop?category=dresses' },
];

const HELP_LINKS = [
  { label: 'My Account & Orders', to: '/account' },
  { label: 'Bespoke Sizing Guide', to: '/account' },
  { label: 'Pan-India Delivery Policy', to: '/shop' },
  { label: 'Alterations & Exchanges', to: '/account' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-neutral-400 border-t border-[#C9A96E]/20 text-xs">
      {/* Newsletter Strip */}
      <div className="border-b border-neutral-900 py-12 bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A]">
        <div className="container-site text-center max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-[#C9A96E] font-bold block mb-2">
            The Couture Circle
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
            Join the Kuhuu Fashion Guild
          </h2>
          <p className="text-neutral-400 text-xs mb-6">
            Receive private preview invites for new festive drops, runway reels, and bespoke bridal trunk shows.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs focus:outline-none focus:border-[#C9A96E]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#C9A96E] hover:bg-[#b5955b] text-black font-semibold text-xs tracking-widest uppercase rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                KUHUU <span className="text-[#C9A96E] font-normal italic">Fashion</span>
              </span>
            </Link>
            <p className="text-neutral-400 leading-relaxed max-w-sm">
              Couture crafted in Surat, India. Celebrating intricate Kundan handwork, heavy sequins, cascading ruffles, and timeless Indian drapery.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-[#DD2A7B] text-white flex items-center justify-center transition-colors shadow-md"
                title="Follow on Instagram"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors shadow-md"
                title="WhatsApp Stylist"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-[#C9A96E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-[#C9A96E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Surat Flagship Boutique */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Surat Flagship
            </h4>
            <div className="space-y-3 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#C9A96E] shrink-0 mt-0.5" />
                <span className="leading-snug">{STORE_INFO.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-[#C9A96E] shrink-0 mt-0.5" />
                <span className="leading-snug">Mon–Sat: 9 AM–8 PM<br />Sun: 9 AM–3 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#C9A96E] shrink-0" />
                <span>{STORE_INFO.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Kuhuu Fashion. All rights reserved. Handcrafted in Surat, Gujarat.</p>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="hover:text-neutral-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/shop" className="hover:text-neutral-300">Terms of Service</Link>
            <span>•</span>
            <Link to="/shop" className="hover:text-neutral-300">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
