import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'totalSold:desc', label: 'Best Selling' },
  { value: 'basePrice:asc', label: 'Price: Low → High' },
  { value: 'basePrice:desc', label: 'Price: High → Low' },
  { value: 'averageRating:desc', label: 'Top Rated' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 999999 },
];

type Product = {
  id: string;
  name: string;
  slug: string;
  images: Array<{ id: string; alt?: string; isPrimary: boolean }>;
  variants: Array<{ id: string; price: number; compareAtPrice?: number; stock: number; size?: string; color?: string }>;
  averageRating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
};

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'createdAt:desc';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const isNew = searchParams.get('isNew') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, category, sort, size, minPrice, maxPrice, isNew, page }],
    queryFn: () => {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(category && { category }),
        ...(sort && { sort }),
        ...(size && { size }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(isNew && { isNew }),
        page: String(page),
        limit: '20',
      });
      return api.get(`/products?${params}`).then((r) => r.data);
    },
  });

  const products: Product[] = data?.data?.products || data?.data || [];
  const total: number = data?.meta?.total || 0;
  const totalPages = data?.meta?.totalPages || 1;

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({ sort });
  };

  const hasFilters = !!(category || size || minPrice || maxPrice || isNew || search);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', padding: '2.5rem 0' }}>
        <div className="container-site">
          <h1
            className="text-display"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {search ? `"${search}"` : category ? category.replace(/-/g, ' ') : 'All Products'}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
            {isLoading ? '...' : `${total} product${total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="container-site" style={{ padding: '2rem 0 4rem' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              id="filter-toggle-btn"
              style={{ gap: '0.5rem' }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasFilters && (
                <span style={{ background: 'var(--color-brand)', color: '#fff', borderRadius: '999px', padding: '0 6px', fontSize: '0.6rem', lineHeight: '16px' }}>
                  •
                </span>
              )}
            </button>

            {/* Active filter chips */}
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="pill"
                id="clear-all-filters"
                style={{ fontSize: '0.65rem', color: 'var(--color-error)' }}
              >
                <X size={10} />
                Clear All
              </button>
            )}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sort by:
            </span>
            <div style={{ position: 'relative' }}>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                id="sort-select"
                style={{
                  appearance: 'none',
                  padding: '0.4rem 2rem 0.4rem 0.75rem',
                  border: '1px solid var(--color-border)',
                  background: '#fff',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
            </div>
          </div>
        </div>

        {/* Filters row (collapsible) */}
        {filtersOpen && (
          <div
            style={{
              border: '1px solid var(--color-border)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              background: '#fff',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Size filter */}
            <div>
              <p className="label" style={{ marginBottom: '0.625rem' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? 'selected' : ''}`}
                    onClick={() => updateParam('size', size === s ? '' : s)}
                    id={`filter-size-${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <p className="label" style={{ marginBottom: '0.625rem' }}>Price</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {PRICE_RANGES.map((r) => {
                  const active = minPrice === String(r.min) && maxPrice === String(r.max);
                  return (
                    <button
                      key={r.label}
                      onClick={() => {
                        if (active) {
                          updateParam('minPrice', '');
                          updateParam('maxPrice', '');
                        } else {
                          const next = new URLSearchParams(searchParams);
                          next.set('minPrice', String(r.min));
                          next.set('maxPrice', String(r.max));
                          next.delete('page');
                          setSearchParams(next);
                        }
                      }}
                      id={`filter-price-${r.label}`}
                      style={{
                        padding: '0.375rem 0.75rem',
                        border: '1px solid',
                        borderColor: active ? 'var(--color-brand)' : 'var(--color-border)',
                        background: active ? 'var(--color-brand)' : 'transparent',
                        color: active ? '#fff' : 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other filters */}
            <div>
              <p className="label" style={{ marginBottom: '0.625rem' }}>More</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { key: 'isNew', value: 'true', label: 'New Arrivals' },
                  { key: 'isBestSeller', value: 'true', label: 'Best Sellers' },
                  { key: 'inStock', value: 'true', label: 'In Stock Only' },
                ].map((f) => (
                  <label
                    key={f.key}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    <input
                      type="checkbox"
                      checked={searchParams.get(f.key) === f.value}
                      onChange={(e) => updateParam(f.key, e.target.checked ? f.value : '')}
                      id={`filter-${f.key}`}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '40%' }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              No products found
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting your filters or search term
            </p>
            <button className="btn btn-outline" onClick={clearAllFilters} id="no-results-clear">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('page', String(p));
                      setSearchParams(next);
                      window.scrollTo(0, 0);
                    }}
                    id={`page-btn-${p}`}
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      border: '1px solid',
                      borderColor: p === page ? 'var(--color-brand)' : 'var(--color-border)',
                      background: p === page ? 'var(--color-brand)' : 'transparent',
                      color: p === page ? '#fff' : 'var(--color-text-secondary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
