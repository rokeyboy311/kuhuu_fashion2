import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { STORE_INFO } from '@/data/productsData';

const NAV_LINKS = [
  { label: 'All Collections', to: '/shop' },
  { label: 'Festive Edit', to: '/shop?category=festive-edit' },
  { label: 'Ethnic Wear', to: '/shop?category=ethnic-wear' },
  { label: 'Indo-Western', to: '/shop?category=indo-western' },
  { label: 'Instagram Viral', to: '/#instagram-reels' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.size);
  const { isAuthenticated } = useAuthStore();
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`site-header sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-[#EBE7DF] ${scrolled ? 'shadow-md py-2.5' : 'py-4'}`}>
        <div className="container-site">
          <div className="header-inner flex items-center justify-between">
            {/* Desktop Navigation */}
            <nav className="header-nav hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs font-semibold uppercase tracking-widest transition-colors ${
                      isActive ? 'text-[#947A46]' : 'text-neutral-700 hover:text-neutral-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-neutral-800"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              id="header-menu-btn"
            >
              <Menu size={22} />
            </button>

            {/* Logo Center */}
            <Link to="/" className="text-center group">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest uppercase text-neutral-900 block group-hover:text-[#947A46] transition-colors">
                KUHUU
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#947A46] block -mt-1 font-sans font-medium">
                Couture • Surat
              </span>
            </Link>

            {/* Actions Right */}
            <div className="header-actions flex items-center gap-4">
              {/* WhatsApp Quick Link */}
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:opacity-80 transition-opacity"
                title="Chat with Surat Atelier Stylist"
              >
                <MessageCircle size={16} />
                <span className="hidden xl:inline text-[11px] uppercase tracking-wider">Stylist</span>
              </a>

              {/* Search */}
              <button
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                id="header-search-btn"
              >
                <Search size={19} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
                aria-label="Wishlist"
                id="header-wishlist-btn"
              >
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={isAuthenticated ? '/account' : '/account'}
                className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                aria-label="Account"
                id="header-account-btn"
              >
                <User size={19} />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                className="p-2 text-neutral-900 hover:text-[#947A46] transition-colors relative"
                onClick={toggleCart}
                aria-label="Cart"
                id="header-cart-btn"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0E0E0E] text-[#C9A96E] text-[10px] font-bold flex items-center justify-center shadow-md">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-start p-4 sm:p-8 animate-fade-in">
          <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-2xl mt-12">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
              <span className="text-xs uppercase font-bold tracking-widest text-[#947A46]">
                Search Creations
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 transition-colors"
                id="search-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for black kundan, ruffle, lehenga, saree..."
                  className="w-full px-4 py-3.5 bg-[#F7F5F0] border border-[#EBE7DF] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#C9A96E]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  id="search-input"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3.5 px-4 py-1.5 bg-[#0E0E0E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-[11px] uppercase font-bold tracking-wider text-neutral-400 mb-3">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Black Kundan Drape', 'Off-White Ruffle Suit', 'Emerald Bridal Lehenga', 'Organza Saree', 'Velvet Anarkali'].map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1.5 rounded-full bg-[#F7F5F0] hover:bg-[#EBE7DF] text-xs text-neutral-700 transition-colors"
                    onClick={() => {
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 flex flex-col p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
              <div>
                <span className="font-serif text-lg font-bold tracking-widest text-neutral-900 block">
                  KUHUU FASHION
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#947A46]">Surat Flagship Atelier</span>
              </div>
              <button onClick={() => setMobileOpen(false)} id="mobile-menu-close">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-3 px-3 rounded-lg text-xs uppercase font-semibold tracking-wider text-neutral-800 hover:bg-[#F7F5F0] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-neutral-100 space-y-3">
              <Link
                to="/account"
                className="w-full py-2.5 px-4 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg block text-center"
                onClick={() => setMobileOpen(false)}
              >
                My Account & Orders
              </Link>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Stylist</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
