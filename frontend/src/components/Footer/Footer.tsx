import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone } from 'lucide-react';

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

const SHOP_LINKS = [
  { label: 'New Arrivals', to: '/shop?isNew=true' },
  { label: 'Dresses', to: '/shop?category=dresses' },
  { label: 'Tops', to: '/shop?category=tops' },
  { label: 'Ethnic Wear', to: '/shop?category=ethnic-wear' },
  { label: 'Western Wear', to: '/shop?category=western-wear' },
  { label: 'Sale', to: '/shop?category=sale' },
];

const HELP_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Shipping Policy', to: '/shipping-policy' },
  { label: 'Return Policy', to: '/return-policy' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Track Order', to: '/account/orders' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Cancellation Policy', to: '/cancellation-policy' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0f0f0f', color: 'rgba(255,255,255,0.8)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '3rem 0' }}>
        <div className="container-site text-center">
          <h2
            className="text-display"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '0.06em', marginBottom: '0.75rem', color: '#fff', fontWeight: 400 }}
          >
            Join the Kuhuu Community
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Be the first to know about new collections, exclusive offers, and fashion tips.
          </p>
          <form
            className="flex gap-2 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              id="newsletter-email"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
              className="placeholder:text-white/30"
            />
            <button
              type="submit"
              id="newsletter-submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#fff',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-site" style={{ padding: '3rem 0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          {/* Brand column */}
          <div>
            <div
              className="text-display"
              style={{ fontSize: '1.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', fontWeight: 400 }}
            >
              Kuhuu
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Premium Indian fashion, inspired by everyday elegance. Discover curated styles that celebrate you.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://instagram.com/kuhuu_fashion"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-instagram"
                style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', color: '#fff' }}
                aria-label="Instagram"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp"
                style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', color: '#fff' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Shop
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                    className="hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Help
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {HELP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}
                    className="hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Mail size={14} style={{ marginTop: '2px', opacity: 0.5, flexShrink: 0 }} />
                <a
                  href="mailto:support@kuhuufashion.com"
                  id="footer-email"
                  style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}
                  className="hover:text-white"
                >
                  support@kuhuufashion.com
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Phone size={14} style={{ marginTop: '2px', opacity: 0.5, flexShrink: 0 }} />
                <a
                  href="tel:+91XXXXXXXXXX"
                  id="footer-phone"
                  style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}
                  className="hover:text-white"
                >
                  +91 XXXX XXXXXX
                </a>
              </li>
            </ul>
            <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Support Hours
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                Mon–Sat, 10am – 7pm IST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 0' }}>
        <div className="container-site" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} Kuhuu Fashion. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                className="hover:text-white/60"
              >
                {l.label}
              </Link>
            ))}
          </div>
          {/* Payment icons text */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Payments:
            </span>
            {['UPI', 'Visa', 'Mastercard', 'Razorpay', 'COD'].map((p) => (
              <span
                key={p}
                style={{
                  padding: '2px 6px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '2px',
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.04em',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

