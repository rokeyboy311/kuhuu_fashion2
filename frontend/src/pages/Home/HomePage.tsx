import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import { getBannerThumbUrl, getInstagramThumbUrl } from '@/utils/imageUrl';

function InstagramIcon({ size = 18, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

// ─── Data hooks ───────────────────────────────────────────────

function useBanners() {
  return useQuery({ queryKey: ['banners'], queryFn: () => api.get('/banners').then(r => r.data.data) });
}

function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products?isFeatured=true&limit=8').then(r => r.data.data),
  });
}

function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => api.get('/products?isNew=true&limit=8').then(r => r.data.data),
  });
}

function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data.data) });
}

function useInstagramPosts() {
  return useQuery({ queryKey: ['instagram-posts'], queryFn: () => api.get('/instagram-posts').then(r => r.data.data) });
}

function useAnnouncement() {
  return useQuery({ queryKey: ['announcement'], queryFn: () => api.get('/admin/announcement').then(r => r.data.data) });
}

// ─── Components ───────────────────────────────────────────────

function SkeletonProductGrid({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '14px', width: '40%' }} />
        </div>
      ))}
    </div>
  );
}

function HeroSection() {
  const { data: banners } = useBanners();
  const primaryBanner = banners?.[0];

  return (
    <section className="hero" id="hero">
      {primaryBanner ? (
        <img
          src={getBannerThumbUrl(primaryBanner.id)}
          alt={primaryBanner.title}
          className="hero-image"
        />
      ) : (
        // Placeholder gradient hero when no banner is configured
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1a1a1a 100%)',
          }}
        />
      )}

      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-tag" style={{ color: 'rgba(201, 169, 110, 0.9)' }}>
          {primaryBanner?.subtitle || 'New Collection'}
        </p>
        <h1 className="hero-title" style={{ color: '#fff' }}>
          {primaryBanner?.title || (
            <>
              Elevate Your<br />Everyday Style
            </>
          )}
        </h1>
        <Link
          to={primaryBanner?.link || '/shop'}
          className="btn"
          id="hero-shop-btn"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.5)',
            color: '#fff',
            padding: '0.875rem 2.5rem',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
          }}
        >
          {primaryBanner?.buttonText || 'Shop Now'}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function CategorySection() {
  const { data: categories } = useCategories();

  const featured = (categories || []).filter(
    (c: { slug: string }) => !['sale'].includes(c.slug)
  ).slice(0, 6);

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container-site">
        <div className="section-heading">
          <h2>Shop by Category</h2>
          <div className="divider" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          {(featured.length > 0 ? featured : [
            { slug: 'dresses', name: 'Dresses' },
            { slug: 'tops', name: 'Tops' },
            { slug: 'ethnic-wear', name: 'Ethnic Wear' },
            { slug: 'western-wear', name: 'Western Wear' },
            { slug: 'new-arrivals', name: 'New Arrivals' },
            { slug: 'accessories', name: 'Accessories' },
          ]).map((cat: { slug: string; name: string }) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              id={`category-${cat.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.5rem 1rem',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                background: '#fff',
              }}
              className="hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Category placeholder icon */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--color-surface-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                {cat.slug === 'dresses' ? '👗' :
                 cat.slug === 'tops' ? '👚' :
                 cat.slug === 'ethnic-wear' ? '🥻' :
                 cat.slug === 'western-wear' ? '👖' :
                 cat.slug === 'accessories' ? '👜' : '✨'}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { data, isLoading } = useFeaturedProducts();
  const products = data?.products || data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section style={{ padding: '4rem 0', background: 'var(--color-surface-muted)' }}>
      <div className="container-site">
        <div className="section-heading" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', textAlign: 'left' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem', textAlign: 'left' }}>Best Sellers</h2>
            <div className="divider" style={{ margin: '0.75rem 0 0' }} />
          </div>
          <Link
            to="/shop?isBestSeller=true"
            id="view-all-bestsellers"
            style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {isLoading ? (
            <SkeletonProductGrid count={4} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {products.slice(0, 8).map((product: {
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
              }) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const { data, isLoading } = useNewArrivals();
  const products = data?.products || data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container-site">
        <div
          className="section-heading"
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', textAlign: 'left' }}
        >
          <div>
            <h2 style={{ marginBottom: '0.25rem', textAlign: 'left' }}>New Arrivals</h2>
            <div className="divider" style={{ margin: '0.75rem 0 0' }} />
          </div>
          <Link
            to="/shop?isNew=true"
            id="view-all-new"
            style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {isLoading ? (
            <SkeletonProductGrid count={4} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {products.slice(0, 8).map((product: {
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
              }) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  const { data: posts } = useInstagramPosts();

  return (
    <section style={{ padding: '4rem 0', background: 'var(--color-surface-muted)' }}>
      <div className="container-site">
        <div className="section-heading">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <InstagramIcon size={18} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ marginBottom: 0 }}>Follow @kuhuu_fashion</h2>
          </div>
          <div className="divider" />
          <p>Get inspired by our latest looks</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {(posts && posts.length > 0 ? posts : Array.from({ length: 6 })).map(
            (post: { id?: string; link?: string; caption?: string } | undefined, index: number) => (
              <a
                key={post?.id || index}
                href={post?.link || 'https://instagram.com/kuhuu_fashion'}
                target="_blank"
                rel="noopener noreferrer"
                id={`instagram-post-${post?.id || index}`}
                style={{
                  aspectRatio: '1/1',
                  overflow: 'hidden',
                  display: 'block',
                  position: 'relative',
                  background: 'var(--color-surface-muted)',
                }}
                className="group"
              >
                {post?.id ? (
                  <img
                    src={getInstagramThumbUrl(post.id)}
                    alt={post.caption || 'Kuhuu Fashion Instagram'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    className="group-hover:scale-105"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, hsl(${index * 40}, 30%, 85%) 0%, hsl(${index * 40 + 20}, 40%, 75%) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <InstagramIcon size={24} style={{ opacity: 0.3 }} />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.3s ease',
                  }}
                  className="group-hover:bg-black/30"
                >
                  <InstagramIcon size={22} style={{ color: '#fff', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100" />
                </div>
              </a>
            )
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href="https://instagram.com/kuhuu_fashion"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            id="instagram-follow-btn"
          >
            <InstagramIcon size={14} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: '🚚', title: 'Free Shipping', sub: 'On orders above ₹999' },
    { icon: '↩️', title: 'Easy Returns', sub: '7-day hassle-free returns' },
    { icon: '🔒', title: 'Secure Payment', sub: 'Razorpay & COD available' },
    { icon: '⚡', title: 'Fast Dispatch', sub: 'Ships within 24–48 hours' },
  ];

  return (
    <section style={{ padding: '3rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container-site">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
          {badges.map((b) => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{b.icon}</span>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>{b.title}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Homepage ────────────────────────────────────────────

export default function HomePage() {
  const { data: announcement } = useAnnouncement();

  return (
    <>
      {/* Announcement Bar */}
      {announcement && (
        <div
          className="announcement-bar"
          style={{ background: announcement.bgColor, color: announcement.textColor }}
          id="announcement-bar"
        >
          {announcement.link ? (
            <Link to={announcement.link}>{announcement.text}</Link>
          ) : (
            <span>{announcement.text}</span>
          )}
        </div>
      )}

      {/* Hero */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Categories */}
      <CategorySection />

      {/* Best Sellers */}
      <FeaturedProducts />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Instagram */}
      <InstagramSection />
    </>
  );
}


