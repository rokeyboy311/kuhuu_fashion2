import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Truck, Clock, Scissors, MapPin, Phone, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import InstagramReelsSection from '@/components/Instagram/InstagramReelsSection';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '@/data/productsData';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
  const newArrivals = PRODUCTS.filter((p) => p.isNew);
  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#FAF8F5] text-neutral-900">
      {/* Top Announcement Bar */}
      <div className="bg-[#0E0E0E] text-[#C9A96E] py-2 px-4 text-xs tracking-widest text-center uppercase font-medium flex items-center justify-center gap-2 border-b border-[#C9A96E]/20">
        <Sparkles size={13} className="animate-spin-slow" />
        <span>Festive Edit 2026 Live • Free Shipping Across India • Surat Boutique: Ghod Dod Road</span>
        <Sparkles size={13} className="animate-spin-slow" />
      </div>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center bg-[#0C0C0C] text-white overflow-hidden">
        {/* Background Hero Banner */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero_banner.jpg"
            alt="Kuhuu Fashion Couture Runway Surat"
            className="w-full h-full object-cover object-center brightness-75 scale-100 animate-fade-in"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>

        <div className="container-site relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A96E]/40 text-[#C9A96E] text-xs uppercase tracking-widest mb-6 font-medium">
              <span>Boutique Atelier • Surat, Gujarat</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.15] mb-6">
              Couture Crafted in <span className="italic text-[#C9A96E]">Surat</span>, Made for the World
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8 max-w-xl">
              Discover viral partywear drapes, intricate Kundan handwork, and fluid ruffle silhouettes designed to make every entrance unforgettable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                id="hero-explore-btn"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A96E] hover:bg-[#b5955b] text-black font-semibold text-xs tracking-widest uppercase rounded-md shadow-xl transition-all hover:scale-105"
              >
                <span>Explore Collections</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="#instagram-reels"
                id="hero-reels-btn"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs tracking-widest uppercase rounded-md transition-colors"
              >
                <span>View Instagram Reels</span>
              </a>
            </div>

            {/* Trust Highlights Strip */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-2xl font-bold text-[#C9A96E]">23+</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400">Runway Silhouettes</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#C9A96E]">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400">Handcrafted in Surat</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#C9A96E]">Pan-India</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400">Insured Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Ribbon */}
      <section className="bg-white border-y border-[#EBE7DF] py-6 shadow-sm">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#947A46]">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Pan-India Express</h4>
                <p className="text-[11px] text-neutral-500">Free delivery on orders above ₹1,999</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#947A46]">
                <Scissors size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Bespoke Fitting</h4>
                <p className="text-[11px] text-neutral-500">Custom size tailoring on request</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#947A46]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Artisan Guarantee</h4>
                <p className="text-[11px] text-neutral-500">Authentic hand embroidery & fabrics</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#947A46]">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">WhatsApp Stylist</h4>
                <p className="text-[11px] text-neutral-500">Instant consultation & video tour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Viral Outfits Callout (The 2 Instagram Showcases) */}
      <section className="py-20 bg-[#F5F2EB]">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#947A46] uppercase block mb-2">
              Instagram Viral Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal">
              The Statement Showcases
            </h2>
            <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto mt-4 mb-4" />
            <p className="text-sm text-neutral-600">
              The two viral outfits from <span className="font-semibold text-neutral-900">@kuhuu_fashion</span> that captivated festive and wedding runways this season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Reel 1 Highlight */}
            <div className="bg-white rounded-2xl p-6 border border-[#EBE7DF] shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-xl overflow-hidden bg-black relative">
                <img
                  src="/assets/images/black_kundan_gown.jpg"
                  alt="Black Kundan Drape"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-[#C9A96E] text-[10px] uppercase font-bold tracking-widest">
                  64 Likes • Reel
                </span>
              </div>

              <div className="w-full sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#947A46]">Festive Saree Gown</span>
                  <h3 className="font-serif text-xl text-neutral-900 font-medium mt-1 mb-2">
                    Midnight Black Kundan & Sequins Drape
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    "Black is not just a color, it's an emotion! Kundan work, heavy sequins, aur elegant drape ka perfect blend..."
                  </p>
                  <div className="text-lg font-semibold text-neutral-900 mb-4">
                    ₹8,499 <span className="text-xs text-neutral-400 line-through">₹12,999</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/product/black-kundan-sequins-statement-drape"
                    className="py-2.5 px-4 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold text-center rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    View Outfit Details
                  </Link>
                  <a
                    href="https://www.instagram.com/kuhuu_fashion/reel/DaZ77CBt0P-/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider font-medium text-center rounded-lg hover:border-neutral-900 transition-colors"
                  >
                    Watch on Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Reel 2 Highlight */}
            <div className="bg-white rounded-2xl p-6 border border-[#EBE7DF] shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-xl overflow-hidden bg-black relative">
                <img
                  src="/assets/images/offwhite_ruffle_suit.jpg"
                  alt="Off-White Ruffle Gown Suit"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-[#C9A96E] text-[10px] uppercase font-bold tracking-widest">
                  68 Likes • Reel
                </span>
              </div>

              <div className="w-full sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#947A46]">Indo-Western Couture</span>
                  <h3 className="font-serif text-xl text-neutral-900 font-medium mt-1 mb-2">
                    The Off-White Elegance Ruffle Suit
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                    "Elegance in every detail. Stunning off-white outfit featuring cascading ruffle details and intricate gold embroidery..."
                  </p>
                  <div className="text-lg font-semibold text-neutral-900 mb-4">
                    ₹6,999 <span className="text-xs text-neutral-400 line-through">₹9,999</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/product/off-white-elegance-ruffle-gown-suit"
                    className="py-2.5 px-4 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold text-center rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    View Outfit Details
                  </Link>
                  <a
                    href="https://www.instagram.com/kuhuu_fashion/reel/Dadg47htEL_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider font-medium text-center rounded-lg hover:border-neutral-900 transition-colors"
                  >
                    Watch on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs & Product Showcase */}
      <section className="py-20">
        <div className="container-site">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#947A46] uppercase block mb-1">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal">
                Explore Signature Silhouettes
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 md:mt-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all shrink-0 ${
                    activeCategory === cat.slug
                      ? 'bg-[#0E0E0E] text-[#C9A96E] shadow-md'
                      : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold tracking-widest uppercase rounded-lg transition-colors shadow-md"
            >
              <span>View Full Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 bg-[#F7F5F0] border-t border-[#EBE7DF]">
        <div className="container-site">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#947A46] uppercase block mb-1">
                Most Adored
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop?sort=totalSold:desc"
              className="text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-[#947A46] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Reels Section */}
      <InstagramReelsSection />

      {/* Surat Flagship Atelier & Story Section */}
      <section className="py-24 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Imagery Showcase */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
                <img
                  src="/assets/images/emerald_lehenga.jpg"
                  alt="Kuhuu Fashion Surat Atelier Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block w-52 p-5 bg-[#0E0E0E] text-white rounded-2xl shadow-2xl border border-[#C9A96E]/30">
                <span className="text-[10px] text-[#C9A96E] font-bold uppercase tracking-widest block mb-1">Since 2026</span>
                <p className="font-serif text-base text-white leading-snug">The Heart of Surat's Textile Artistry</p>
              </div>
            </div>

            {/* Right Story Content */}
            <div className="lg:pl-8">
              <span className="text-xs font-bold tracking-widest text-[#947A46] uppercase block mb-2">
                About Kuhuu Fashion
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal mb-6 leading-tight">
                Honoring the Textile Soul of Surat with Modern Couture
              </h2>
              <p className="text-neutral-600 leading-relaxed text-sm mb-4">
                Born in Surat, Gujarat — India’s celebrated textile and diamond capital — <strong>Kuhuu Fashion</strong> bridges centuries of artisanal hand embroidery, zardozi needlework, and opulent kundan borders with contemporary draped silhouettes.
              </p>
              <p className="text-neutral-600 leading-relaxed text-sm mb-8">
                Whether you are stepping into a starlit cocktail party in Mumbai, a wedding sangeet in Surat, or receiving our package in New York, each creation is tailored with meticulous precision, premium fabrics, and soul.
              </p>

              {/* Store Details Card */}
              <div className="p-6 rounded-xl bg-[#F7F5F0] border border-[#EBE7DF] mb-8 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#947A46] shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-700">
                    <strong className="block text-neutral-900 text-sm mb-0.5">Surat Flagship Atelier:</strong>
                    {STORE_INFO.address}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#947A46] shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-700">
                    {STORE_INFO.hours.weekdays} • {STORE_INFO.hours.sunday}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={STORE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs tracking-wider uppercase rounded-lg shadow-md transition-colors"
                >
                  <MessageCircle size={16} />
                  Book Store Appointment
                </a>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors"
                >
                  Browse Creations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F5F2EB] border-t border-[#EBE7DF]">
        <div className="container-site">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#947A46] uppercase block mb-1">
              Client Praises
            </span>
            <h2 className="font-serif text-3xl text-neutral-900 font-normal">
              Words From Our Patrons
            </h2>
            <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[#EBE7DF] shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed italic mb-4">
                "I ordered the Black Kundan Saree Gown after seeing the Instagram reel. The fit was absolutely tailor-made and the drape looked like something right off the Lakmé Fashion Week runway!"
              </p>
              <div className="font-medium text-xs text-neutral-900">
                Pooja Patel • <span className="text-neutral-500">Ahmedabad</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#EBE7DF] shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed italic mb-4">
                "Visited their Surat store on Ghod Dod Road for my sangeet shopping. The Off-White ruffle suit exceeded all expectations. Exceptional craftsmanship and warmth by the staff."
              </p>
              <div className="font-medium text-xs text-neutral-900">
                Dharaben Shah • <span className="text-neutral-500">Surat</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#EBE7DF] shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed italic mb-4">
                "Ordered to Delhi within 3 days express shipping. The packaging was immaculate with garment covers, and the fabric quality is truly world-class. Will definitely order again!"
              </p>
              <div className="font-medium text-xs text-neutral-900">
                Meenakshi Verma • <span className="text-neutral-500">New Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
