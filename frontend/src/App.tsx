import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import { useAuthStore } from '@/store/authStore';

// Lazy loaded pages
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const ShopPage = lazy(() => import('@/pages/Shop/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/Product/ProductDetailPage'));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/Checkout/OrderSuccessPage'));
const AccountPage = lazy(() => import('@/pages/Account/AccountPage'));
const WishlistPage = lazy(() => import('@/pages/Wishlist/WishlistPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Storefront */}
            <Route
              path="/"
              element={
                <StorefrontLayout>
                  <HomePage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/shop"
              element={
                <StorefrontLayout>
                  <ShopPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <StorefrontLayout>
                  <ProductDetailPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/wishlist"
              element={
                <StorefrontLayout>
                  <RequireAuth>
                    <WishlistPage />
                  </RequireAuth>
                </StorefrontLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <StorefrontLayout>
                  <RequireAuth>
                    <CheckoutPage />
                  </RequireAuth>
                </StorefrontLayout>
              }
            />
            <Route
              path="/order-success/:orderId"
              element={
                <StorefrontLayout>
                  <OrderSuccessPage />
                </StorefrontLayout>
              }
            />
            <Route
              path="/account/*"
              element={
                <StorefrontLayout>
                  <RequireAuth>
                    <AccountPage />
                  </RequireAuth>
                </StorefrontLayout>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              fontSize: '0.85rem',
              borderRadius: '2px',
              padding: '12px 16px',
              maxWidth: '360px',
            },
            success: {
              iconTheme: { primary: '#c9a96e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#c0392b', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
