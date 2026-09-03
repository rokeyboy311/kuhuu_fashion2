import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Share2, Star, ChevronRight, Truck, RotateCcw, ShieldCheck, Scissors, MessageCircle, Check, Sparkles } from 'lucide-react';
import InstagramIcon from '@/components/Icons/InstagramIcon';
import api from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard/ProductCard';
import { getProductBySlug, PRODUCTS, generateWhatsAppOrderUrl, STORE_INFO } from '@/data/productsData';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  // Fallback / Standalone Product Data
  const localProduct = slug ? getProductBySlug(slug) : undefined;

  // Optional API query if backend is active
  const { data: apiData } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
    retry: false,
  });

  const product: any = localProduct || (apiData ? {
    id: apiData.id,
    name: apiData.name,
    slug: apiData.slug,
    category: apiData.category?.slug || 'festive-edit',
    categoryName: apiData.category?.name || 'Festive Edit',
    basePrice: apiData.variants?.[0]?.price || 4999,
    compareAtPrice: apiData.variants?.[0]?.compareAtPrice || 6999,
    image: apiData.images?.[0]?.id ? `/api/v1/images/${apiData.images[0].id}/image` : '/assets/images/black_kundan_gown.jpg',
    images: (apiData.images || []).map((img: { id: string }) => `/api/v1/images/${img.id}/image`),
    description: apiData.description,
    shortDesc: apiData.shortDesc || '',
    details: ['Premium Handcrafted Fabric', 'Dry Clean Only', 'Handcrafted in Surat, Gujarat'],
    care: 'Dry clean only',
    isFeatured: apiData.isFeatured,
    isBestSeller: apiData.isBestSeller,
    isNew: apiData.isNew,
    rating: apiData.averageRating || 4.9,
    reviewCount: apiData.reviewCount || 12,
    stock: 5,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitched'],
    colors: [{ name: 'Classic', hex: '#111' }],
  } : undefined);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || 'M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');

  if (!product) {
    return (
      <div className="container-site py-24 text-center">
        <h2 className="font-serif text-2xl text-neutral-900 mb-2">Creations Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">The design you are looking for is currently unavailable or has been archived.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold rounded-lg">
          Browse All Collections
        </Link>
      </div>
    );
  }

  const imagesList = product.images.length > 0 ? product.images : [product.image];
  const activeImage = imagesList[activeImageIndex] || product.image;

  const currentPrice = product.basePrice;
  const originalPrice = product.compareAtPrice;
  const hasDiscount = originalPrice > currentPrice;
  const discountPct = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, `var-${selectedSize}`, qty);
    toast.success(`${product.name} added to your bag!`);
  };

  const handleBuyNow = () => {
    addToCart(product.id, `var-${selectedSize}`, qty);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    window.open(generateWhatsAppOrderUrl(product.name, selectedSize, currentPrice), '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDesc,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="container-site">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-neutral-900">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-neutral-900">Collections</Link>
          <ChevronRight size={12} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-neutral-900">{product.categoryName}</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery Column */}
          <div className="space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-[#EBE7DF] shadow-lg">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isNew && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#0E0E0E] text-[#C9A96E] border border-[#C9A96E]/30">
                    New Arrival
                  </span>
                )}
                {product.isBestSeller && !product.isNew && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A96E] text-[#0E0E0E]">
                    Bestseller
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-red-600 text-white">
                    {discountPct}% Off
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  wishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white/90 text-neutral-800 hover:bg-white'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Row if multiple images */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imagesList.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#C9A96E] shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Column */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#947A46]">
                  {product.categoryName} • Surat Atelier
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-normal leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-neutral-400">({product.reviewCount} verified Surat & online reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-xl bg-white border border-[#EBE7DF] flex items-baseline justify-between shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-base text-neutral-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Save ₹{(originalPrice - currentPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Instagram Viral Badge if connected to Instagram Reel */}
            {product.instagramUrl && (
              <div className="p-4 rounded-xl bg-[#0E0E0E] text-white flex items-center justify-between border border-[#C9A96E]/40 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shrink-0">
                    <InstagramIcon size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#C9A96E] uppercase font-bold tracking-wider block">Featured on Instagram</span>
                    <p className="text-xs text-neutral-300 line-clamp-1">{product.instagramCaption}</p>
                  </div>
                </div>
                <a
                  href={product.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#C9A96E] hover:underline uppercase tracking-wider whitespace-nowrap ml-4"
                >
                  View Reel →
                </a>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Select Size: <strong className="text-[#947A46]">{selectedSize}</strong>
                </span>
                <span className="text-[11px] text-neutral-500 underline cursor-pointer">
                  Size Guide & Measurements
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      selectedSize === s
                        ? 'bg-[#0E0E0E] text-[#C9A96E] border-[#0E0E0E] shadow-md scale-105'
                        : 'bg-white text-neutral-700 border-[#EBE7DF] hover:border-neutral-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {selectedSize === 'Custom Stitched' && (
                <p className="text-[11px] text-[#947A46] mt-2 flex items-center gap-1.5 font-medium">
                  <Scissors size={13} />
                  Our Surat atelier master tailor will WhatsApp you for exact measurements after checkout!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 bg-[#0E0E0E] hover:bg-[#222] text-[#F5F2EB] font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 bg-[#C9A96E] hover:bg-[#b5955b] text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl text-center"
                >
                  Buy Now
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle size={17} />
                <span>Order via WhatsApp (Instant DM Booking)</span>
              </button>
            </div>

            {/* Trust Assurance Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-[#EBE7DF] text-center">
              <div className="flex flex-col items-center">
                <Truck size={18} className="text-[#947A46] mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Pan-India Express</span>
                <span className="text-[10px] text-neutral-500">Ships in 24-48h</span>
              </div>
              <div className="flex flex-col items-center">
                <Scissors size={18} className="text-[#947A46] mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Custom Fitting</span>
                <span className="text-[10px] text-neutral-500">Made-to-measure</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={18} className="text-[#947A46] mb-1" />
                <span className="text-[11px] font-bold text-neutral-900">Surat Flagship</span>
                <span className="text-[10px] text-neutral-500">100% Authentic</span>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="pt-4 border-t border-[#EBE7DF]">
              <div className="flex border-b border-[#EBE7DF] mb-4">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider mr-6 transition-colors border-b-2 -mb-px ${
                    activeTab === 'details' ? 'border-[#947A46] text-[#947A46]' : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Craft & Details
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider mr-6 transition-colors border-b-2 -mb-px ${
                    activeTab === 'shipping' ? 'border-[#947A46] text-[#947A46]' : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Delivery & Boutique
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                    activeTab === 'reviews' ? 'border-[#947A46] text-[#947A46]' : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Patron Reviews ({product.reviewCount})
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-3 text-xs text-neutral-600 leading-relaxed animate-fade-in">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                    {product.details.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <p className="pt-2 text-neutral-500 italic">Care: {product.care}</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 text-xs text-neutral-600 leading-relaxed animate-fade-in">
                  <p><strong>Insured Pan-India Courier:</strong> Dispatched within 24 to 48 hours via Blue Dart, DTDC, or Delhivery with real-time SMS tracking.</p>
                  <p><strong>In-Store Trial & Pickup:</strong> You can also choose to collect and trial this outfit directly at our Surat store: <em>{STORE_INFO.address}</em>.</p>
                  <p><strong>Alteration Support:</strong> Complimentary alterations available within 7 days of delivery.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 text-xs animate-fade-in">
                  <div className="p-4 rounded-lg bg-white border border-[#EBE7DF]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900">Tanvi R. • Surat</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-neutral-600">"Wore this to my sister's reception. Got non-stop compliments all night! The fabric feels rich and heavy, yet comfortable to dance in."</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-[#EBE7DF]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900">Ananya M. • Mumbai</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-neutral-600">"Prompt WhatsApp communication and exact custom stitching as promised. Super impressed by Kuhuu Fashion!"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Outfits */}
        <div className="mt-24 pt-12 border-t border-[#EBE7DF]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#947A46] block mb-1">Complete The Look</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">Complementary Creations</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold text-neutral-900 hover:text-[#947A46]">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
