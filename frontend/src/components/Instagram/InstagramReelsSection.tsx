import { useState } from 'react';
import { Heart, MessageCircle, ExternalLink, ShoppingBag, CheckCircle2, Play } from 'lucide-react';
import InstagramIcon from '@/components/Icons/InstagramIcon';
import { Link } from 'react-router-dom';
import { INSTAGRAM_REELS, InstagramReel, STORE_INFO } from '@/data/productsData';

export default function InstagramReelsSection() {
  const [activeReel, setActiveReel] = useState<InstagramReel | null>(null);

  return (
    <section className="py-16 bg-[#0E0E0E] text-white relative overflow-hidden" id="instagram-reels">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-site relative z-10">
        {/* Profile Header Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C9A96E]/30 text-[#C9A96E] text-xs uppercase tracking-widest mb-4">
            <InstagramIcon size={14} />
            <span>As Seen On Instagram</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-black">
                <span className="font-serif font-bold text-xl text-[#C9A96E]">K</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <h2 className="text-2xl font-serif text-white tracking-wide">{STORE_INFO.instagram}</h2>
                <CheckCircle2 size={18} className="text-[#C9A96E]" fill="currentColor" stroke="#0E0E0E" />
              </div>
              <p className="text-sm text-neutral-400 font-light">
                Kuhuu By “ Ð “ • <span className="text-[#C9A96E]">334+ Followers</span> • 23 Exclusive Designs
              </p>
            </div>
          </div>

          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Explore our viral showcases, boutique atelier in Surat, and real runway moments. Tap any reel below to shop the outfit!
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#DD2A7B] to-[#9B26B6] text-white text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity"
            >
              <InstagramIcon size={14} />
              Follow @kuhuu_fashion
            </a>
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium tracking-wider uppercase transition-colors"
            >
              DM on WhatsApp
            </a>
          </div>
        </div>

        {/* Featured Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {INSTAGRAM_REELS.map((reel) => (
            <div
              key={reel.id}
              className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#C9A96E]/50 transition-all duration-300 shadow-xl flex flex-col"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-[#C9A96E] font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Viral Reel
                  </span>

                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-colors"
                    title="View Original Reel on Instagram"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Center Play Button Overlay */}
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#C9A96E]/80 transition-all shadow-2xl">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </a>

                {/* Bottom Engagement Counters */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 z-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Heart size={15} className="text-red-500 fill-red-500" />
                      {reel.likes} likes
                    </span>
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <MessageCircle size={15} />
                      {reel.comments} comments
                    </span>
                  </div>
                  <span className="text-neutral-400 text-[11px]">{reel.date}</span>
                </div>
              </div>

              {/* Caption & Product Details */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-neutral-900/90">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium mb-2 group-hover:text-[#C9A96E] transition-colors">
                    {reel.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    "{reel.caption}"
                  </p>
                </div>

                {/* Shop Action Footer */}
                {reel.productSlug && (
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Available in Store</span>
                      <span className="text-base font-semibold text-[#C9A96E]">
                        ₹{reel.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      to={`/product/${reel.productSlug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A96E] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#b5955b] transition-colors"
                    >
                      <ShoppingBag size={14} />
                      Shop Outfit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Surat Flagship Location Callout */}
        <div className="mt-14 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center max-w-2xl mx-auto backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-[#C9A96E] mb-1 font-semibold">📍 Surat Flagship Atelier</p>
          <p className="text-sm text-neutral-300 font-serif">
            {STORE_INFO.address}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Open Monday to Saturday (9 AM – 8 PM) • Sunday (9 AM – 3 PM) • Pan-India Courier Available
          </p>
        </div>
      </div>
    </section>
  );
}
