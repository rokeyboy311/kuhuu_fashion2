import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?isNew=true' },
  { label: 'Collections', to: '/collections' },
  { label: 'Sale', to: '/shop?category=sale' },
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
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-site">
          {/* Desktop layout */}
          <div className="header-inner">
            {/* Nav left */}
            <nav className="header-nav">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Logo center */}
            <Link to="/" className="header-logo">
              Kuhuu
            </Link>

            {/* Actions right */}
            <div className="header-actions">
              {/* Search */}
              <button
                className="header-icon-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                id="header-search-btn"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="header-icon-btn" aria-label="Wishlist" id="header-wishlist-btn">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="badge-count">{wishlistCount}</span>
                )}
              </Link>

              {/* Account */}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="header-icon-btn"
                aria-label="Account"
                id="header-account-btn"
              >
                <User size={18} />
              </Link>

              {/* Cart */}
              <button
                className="header-icon-btn"
                onClick={toggleCart}
                aria-label="Cart"
                id="header-cart-btn"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="badge-count">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="header-icon-btn lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
                id="header-menu-btn"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="container-site py-6">
            <div className="flex items-center justify-between mb-8">
              <span
                className="text-display uppercase tracking-wider-custom"
                style={{ fontSize: '1.125rem', letterSpacing: '0.2em' }}
              >
                Search
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="header-icon-btn"
                id="search-close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for dresses, tops, ethnic wear..."
                className="input"
                style={{ fontSize: '1.25rem', padding: '1rem', border: 'none', borderBottom: '2px solid #000', borderRadius: 0 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                id="search-input"
              />
            </form>
            <div className="mt-6">
              <p className="label mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Dresses', 'Tops', 'Ethnic Wear', 'Co-ord Sets', 'Kurtas'].map((term) => (
                  <button
                    key={term}
                    className="pill"
                    onClick={() => {
                      navigate(`/shop?search=${term}`);
                      setSearchOpen(false);
                    }}
                    id={`popular-search-${term.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-display" style={{ fontSize: '1.25rem', letterSpacing: '0.2em' }}>
                Kuhuu
              </span>
              <button onClick={() => setMobileOpen(false)} id="mobile-menu-close">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-3 border-b border-gray-100 text-sm uppercase tracking-widest"
                  style={{ letterSpacing: '0.1em' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 flex flex-col gap-2">
              <Link to={isAuthenticated ? '/account' : '/login'} className="btn btn-outline btn-full btn-sm" onClick={() => setMobileOpen(false)}>
                My Account
              </Link>
              <Link to="/wishlist" className="btn btn-ghost btn-full btn-sm" onClick={() => setMobileOpen(false)}>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
