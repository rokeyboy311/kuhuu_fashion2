import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '@/store/wishlistStore';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const productIds = useWishlistStore((s) => Array.from(s.productIds));

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((r) => r.data.data),
  });

  const products = data || [];

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border)', padding: '2.5rem 0' }}>
        <div className="container-site">
          <h1 className="text-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            My Wishlist
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
            {products.length} item{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container-site" style={{ padding: '2rem 0 4rem' }}>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i}><div className="skeleton" style={{ aspectRatio: '3/4' }} /></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.15 }} />
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Your wishlist is empty</p>
            <Link to="/shop" className="btn btn-primary btn-sm" id="empty-wishlist-shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {products.map((item: { product: Parameters<typeof ProductCard>[0] }) => (
              <ProductCard key={item.product.id} {...item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
