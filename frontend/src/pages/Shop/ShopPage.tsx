import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/productsData';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured & Viral' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestseller', label: 'Best Sellers' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Customer Rating' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 999999 },
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹8,000', min: 5000, max: 8000 },
  { label: '₹8,000 – ₹12,000', min: 8000, max: 12000 },
  { label: 'Above ₹12,000', min: 12000, max: 999999 },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'featured';
  const priceIndex = parseInt(searchParams.get('price') || '0', 10);

  const selectedPriceRange = PRICE_RANGES[priceIndex] || PRICE_RANGES[0];

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search
      if (search) {
        const query = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category
      if (category && category !== 'all') {
        if (product.category !== category) return false;
      }

      // Price Range
      if (product.basePrice < selectedPriceRange.min || product.basePrice > selectedPriceRange.max) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'price-low') return a.basePrice - b.basePrice;
      if (sort === 'price-high') return b.basePrice - a.basePrice;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sort === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [search, category, sort, selectedPriceRange]);

  const hasActiveFilters = category !== 'all' || search !== '' || priceIndex !== 0;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      {/* Header Banner */}
      <div className="bg-[#0E0E0E] text-white py-14 mb-10 border-b border-[#C9A96E]/20 relative overflow-hidden">
        <div className="container-site relative z-10 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-medium block mb-2">
            Surat Couture Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
            {category !== 'all'
              ? CATEGORIES.find((c) => c.slug === category)?.name || 'Collection'
              : search
              ? `Results for "${search}"`
              : 'All Creations'}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
            Handcrafted luxury partywear, statement drapes, and bespoke festive ensembles from Surat.
          </p>
        </div>
      </div>

      <div className="container-site">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE7DF]">
          {/* Active Filters / Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#EBE7DF] rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-800"
            >
              <SlidersHorizontal size={14} />
              Filters {hasActiveFilters && '(Active)'}
            </button>
            <span className="text-xs text-neutral-500 font-medium">
              Showing <strong>{filteredProducts.length}</strong> creations
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label htmlFor="shop-sort" className="text-xs text-neutral-500 uppercase tracking-wider font-semibold whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="px-3 py-2 bg-white border border-[#EBE7DF] rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#C9A96E]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl lg:shadow-none lg:static lg:w-auto lg:p-0 lg:bg-transparent lg:z-0 lg:block transition-transform duration-300 ${
              filtersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between lg:hidden pb-4 mb-4 border-b border-neutral-200">
              <h3 className="font-serif text-lg font-medium">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[#EBE7DF] p-6 space-y-6 shadow-sm">
              {/* Filter Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <X size={13} />
                  Clear All Filters
                </button>
              )}

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#947A46] mb-3">Category</h4>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        category === cat.slug
                          ? 'bg-[#0E0E0E] text-[#C9A96E] font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#947A46] mb-3">Price Range</h4>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((rng, idx) => (
                    <button
                      key={rng.label}
                      onClick={() => updateParam('price', String(idx))}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        priceIndex === idx
                          ? 'bg-[#0E0E0E] text-[#C9A96E] font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{rng.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram Exclusive Highlight Banner */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="p-4 rounded-lg bg-gradient-to-br from-neutral-900 to-black text-white text-center">
                  <Sparkles size={16} className="text-[#C9A96E] mx-auto mb-2" />
                  <p className="font-serif text-sm text-[#C9A96E] mb-1">Custom Fit Guarantee</p>
                  <p className="text-[11px] text-neutral-400 mb-3">All designs can be customized to your exact body measurements.</p>
                  <a
                    href="https://wa.me/919879012345?text=Hello%20Kuhuu%20Fashion%2C%20I%20want%20to%20know%20about%20custom%20stitching%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 bg-[#C9A96E] text-black text-[11px] font-bold uppercase tracking-wider rounded"
                  >
                    Chat With Stylist
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#EBE7DF] p-12 text-center">
                <Search size={40} className="text-neutral-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-neutral-900 mb-2">No Matching Creations Found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  We could not find any outfits matching your filter criteria. Try clearing some filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
