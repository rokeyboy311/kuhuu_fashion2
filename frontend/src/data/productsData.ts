export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  basePrice: number;
  compareAtPrice: number;
  image: string;
  images: string[];
  description: string;
  shortDesc: string;
  details: string[];
  care: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  instagramUrl?: string;
  instagramCaption?: string;
  instagramLikes?: number;
  instagramReelId?: string;
}

export interface InstagramReel {
  id: string;
  shortcode: string;
  title: string;
  caption: string;
  date: string;
  likes: number;
  comments: number;
  url: string;
  image: string;
  productSlug?: string;
  productName?: string;
  price?: number;
}

export const INSTAGRAM_REELS: InstagramReel[] = [
  {
    id: 'reel-1',
    shortcode: 'DaZ77CBt0P-',
    title: 'Black is an Emotion • Kundan & Sequins Drape',
    caption: 'Black is not just a color, it’s an emotion! 🖤✨ Kundan work, heavy sequins, aur elegant drape ka yeh perfect blend aapko har party ki jaan bana dega. Get ready to turn heads this festive/wedding season with Kuhuu Fashion! 🛍️',
    date: 'July 5, 2026',
    likes: 64,
    comments: 0,
    url: 'https://www.instagram.com/kuhuu_fashion/reel/DaZ77CBt0P-/',
    image: '/assets/images/black_kundan_gown.jpg',
    productSlug: 'black-kundan-sequins-statement-drape',
    productName: 'Midnight Black Kundan & Sequins Statement Drape',
    price: 8499,
  },
  {
    id: 'reel-2',
    shortcode: 'Dadg47htEL_',
    title: 'Elegance in Every Detail • Off-White Ruffle Edit',
    caption: '✨ Elegance in every detail. ✨ Get ready to turn heads with this stunning off-white outfit, featuring beautiful ruffle details and intricate gold embroidery. Perfect for your next special occasion! 🤍 DM us to book yours now!',
    date: 'July 6, 2026',
    likes: 68,
    comments: 2,
    url: 'https://www.instagram.com/kuhuu_fashion/reel/Dadg47htEL_/',
    image: '/assets/images/offwhite_ruffle_suit.jpg',
    productSlug: 'off-white-elegance-ruffle-gown-suit',
    productName: 'The Off-White Elegance Ruffle Gown Suit',
    price: 6999,
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Midnight Black Kundan & Sequins Statement Drape',
    slug: 'black-kundan-sequins-statement-drape',
    category: 'festive-edit',
    categoryName: 'Festive Edit',
    basePrice: 8499,
    compareAtPrice: 12999,
    image: '/assets/images/black_kundan_gown.jpg',
    images: ['/assets/images/black_kundan_gown.jpg', '/assets/images/hero_banner.jpg'],
    shortDesc: 'As seen on Instagram — Hand-set Kundan borders & heavy micro-sequin drape.',
    description:
      'An extraordinary couture statement ensemble blending hand-set Kundan borders, heavy micro-sequin embroidery, and an effortless pre-stitched structured drape. Inspired by our viral Instagram showcase, this silhouette turns heads at high-profile cocktail parties, receptions, and sangeet evenings. Handcrafted by master artisans in Surat, India.',
    details: [
      'Fabric: Pure Georgette & Velvet Accents',
      'Work: Kundan Hand-Setting & Micro-Sequins',
      'Closure: Concealed Side Zip with Hook & Eye',
      'Includes: Pre-draped Saree Gown with Embellished Blouse',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Professional Dry Clean Only. Store wrapped in breathable cotton/muslin.',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 38,
    stock: 6,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitched'],
    colors: [{ name: 'Midnight Black', hex: '#111111' }],
    instagramUrl: 'https://www.instagram.com/kuhuu_fashion/reel/DaZ77CBt0P-/',
    instagramCaption:
      'Black is not just a color, it’s an emotion! 🖤✨ Kundan work, heavy sequins, aur elegant drape ka yeh perfect blend...',
    instagramLikes: 64,
    instagramReelId: 'DaZ77CBt0P-',
  },
  {
    id: 'prod-2',
    name: 'The Off-White Elegance Ruffle Gown Suit',
    slug: 'off-white-elegance-ruffle-gown-suit',
    category: 'indo-western',
    categoryName: 'Indo-Western',
    basePrice: 6999,
    compareAtPrice: 9999,
    image: '/assets/images/offwhite_ruffle_suit.jpg',
    images: ['/assets/images/offwhite_ruffle_suit.jpg'],
    shortDesc: 'Featured on Instagram Reel — Cascading organza ruffles with gold zari embroidery.',
    description:
      'Exuding understated royalty, this ivory off-white ensemble features tier-sculpted cascade ruffles paired with intricate gold zari threadwork and shimmering sequin highlights. Designed for daytime weddings, engagements, and festive soirées.',
    details: [
      'Fabric: Chanderi Silk & Organza Ruffles',
      'Work: Fine Metallic Gold Zari & Resham Embroidery',
      'Occasion: Haldi, Engagement, Day Wedding, Sangeet',
      'Includes: Ruffle Top, Flared Sharara Skirt & Chiffon Dupatta',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Dry Clean Only. Steam iron on reverse.',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 29,
    stock: 4,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitched'],
    colors: [{ name: 'Ivory Off-White', hex: '#FDFBF7' }],
    instagramUrl: 'https://www.instagram.com/kuhuu_fashion/reel/Dadg47htEL_/',
    instagramCaption:
      '✨ Elegance in every detail. ✨ Get ready to turn heads with this stunning off-white outfit...',
    instagramLikes: 68,
    instagramReelId: 'Dadg47htEL_',
  },
  {
    id: 'prod-3',
    name: 'Royal Emerald Zardozi Heritage Bridal Lehenga',
    slug: 'royal-emerald-zardozi-heritage-lehenga',
    category: 'ethnic-wear',
    categoryName: 'Ethnic Wear',
    basePrice: 16499,
    compareAtPrice: 24999,
    image: '/assets/images/emerald_lehenga.jpg',
    images: ['/assets/images/emerald_lehenga.jpg'],
    shortDesc: 'Bespoke bridal couture — Handcrafted zardozi & dabka work on pure raw silk.',
    description:
      'Rich emerald green pure silk lehenga adorned with magnificent antique gold zardozi, dabka, and pearl work. Inspired by royal Indian architecture and Surat’s rich heritage textile legacy.',
    details: [
      'Fabric: Pure Raw Silk with Soft Net Embellished Dupatta',
      'Work: Hand Zardozi, Dabka & Pota Stone Work',
      'Flair: 4.5 Meters Regal Kalidar Cut with Can-Can Canvas',
      'Occasion: Bridal Trousseau, Sangeet, Wedding Reception',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Strictly Dry Clean Only.',
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 45,
    stock: 3,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Stitched'],
    colors: [{ name: 'Royal Emerald', hex: '#0B4F37' }],
  },
  {
    id: 'prod-4',
    name: 'Dusty Rose Shimmer Cocktail Drape Saree',
    slug: 'dusty-rose-shimmer-cocktail-drape-saree',
    category: 'dresses',
    categoryName: 'Dresses & Drapes',
    basePrice: 5499,
    compareAtPrice: 7999,
    image: '/assets/images/blush_drape.jpg',
    images: ['/assets/images/blush_drape.jpg'],
    shortDesc: '1-Minute Ready Drape — Pearl hand-work with shimmering tone-on-tone sequins.',
    description:
      'A contemporary pre-pleated drape saree in romantic dusty rose blush georgette, embellished with hand-stitched pearl borders and delicate shimmer sequins. Slip in and look effortlessly styled in 30 seconds.',
    details: [
      'Fabric: Fluid French Georgette',
      'Work: Pearl Highlights & Tonal Shimmer Sequins',
      'Fit: Ready-to-wear pre-stitched with waistband hook & zip',
      'Occasion: Cocktails, Farewell, Bridesmaid Ensemble',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Gentle Dry Clean Only.',
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 19,
    stock: 8,
    sizes: ['Free Size (Fits Waist 26–38)'],
    colors: [{ name: 'Dusty Rose Blush', hex: '#D8A0A6' }],
  },
  {
    id: 'prod-5',
    name: 'Imperial Ruby Velvet Gota Patti Anarkali Gown',
    slug: 'imperial-ruby-velvet-gota-patti-anarkali',
    category: 'ethnic-wear',
    categoryName: 'Ethnic Wear',
    basePrice: 9899,
    compareAtPrice: 14499,
    image: '/assets/images/ruby_anarkali.jpg',
    images: ['/assets/images/ruby_anarkali.jpg'],
    shortDesc: 'Royal Micro-Velvet — Hand-cut antique gota patti with kundan embellished yoke.',
    description:
      'Crafted in micro-velvet of deep imperial ruby red, this floor-length anarkali features hand-cut antique gota patti medallions and a heavy kundan-embellished neck yoke.',
    details: [
      'Fabric: Premium Micro-Velvet with Pure Organza Dupatta',
      'Work: Traditional Gota Patti & Kundan Border',
      'Flair: 3.8 Meters Circular Hem',
      'Occasion: Karwa Chauth, Diwali, Winter Weddings',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Dry Clean Only.',
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 24,
    stock: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Imperial Ruby', hex: '#800020' }],
  },
  {
    id: 'prod-6',
    name: 'Champagne Gold Handcrafted Organza Saree',
    slug: 'champagne-gold-handcrafted-organza-saree',
    category: 'western-wear',
    categoryName: 'Western & Fusion',
    basePrice: 4299,
    compareAtPrice: 6499,
    image: '/assets/images/champagne_saree.jpg',
    images: ['/assets/images/champagne_saree.jpg'],
    shortDesc: 'Minimal Luxury — Pure tissue organza with metallic cutdana scalloped borders.',
    description:
      'Ethereal tissue organza saree in champagne gold with a delicate metallic embroidered scalloped border and floral butti work. Lightweight, breathable, and effortlessly regal.',
    details: [
      'Fabric: Pure Tissue Organza',
      'Work: Zari Thread & Cutdana Scallop Border',
      'Length: 5.5 Meters Saree + 0.8 Meter Unstitched Blouse Piece',
      'Occasion: High Tea, Day Functions, Reception',
      'Origin: Handcrafted in Surat, Gujarat',
    ],
    care: 'Dry Clean Only.',
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 14,
    stock: 12,
    sizes: ['Free Size'],
    colors: [{ name: 'Champagne Gold', hex: '#E5D3B3' }],
  },
];

export const CATEGORIES = [
  { slug: 'all', name: 'All Collections', count: 6 },
  { slug: 'festive-edit', name: 'Festive Edit', count: 2, icon: '✨' },
  { slug: 'ethnic-wear', name: 'Ethnic Wear', count: 2, icon: '🥻' },
  { slug: 'indo-western', name: 'Indo-Western', count: 1, icon: '👗' },
  { slug: 'dresses', name: 'Dresses & Drapes', count: 1, icon: '💃' },
  { slug: 'western-wear', name: 'Western & Fusion', count: 1, icon: '✨' },
];

export const STORE_INFO = {
  name: 'Kuhuu Fashion',
  tagline: 'Couture Crafted in Surat',
  instagram: '@kuhuu_fashion',
  instagramUrl: 'https://www.instagram.com/kuhuu_fashion/',
  phone: '+91 98790 12345',
  whatsapp: '+91 98790 12345',
  whatsappUrl: 'https://wa.me/919879012345',
  email: 'care@kuhuufashion.com',
  address: 'Shop No. 114, Classic Complex, Ghod Dod Road, Near Parle Point, Athwa, Surat, Gujarat 395007',
  hours: {
    weekdays: 'Monday – Saturday: 9:00 AM – 8:00 PM',
    sunday: 'Sunday: 9:00 AM – 3:00 PM',
  },
};

export function getProductBySlug(slug: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function generateWhatsAppOrderUrl(productName: string, size: string, price: number): string {
  const message = `Hello Kuhuu Fashion! 👋\nI would like to order/inquire about:\n\n*${productName}*\n• Price: ₹${price.toLocaleString('en-IN')}\n• Selected Size: ${size}\n\nPlease share availability, payment options, and delivery timeline. Thank you!`;
  return `https://wa.me/919879012345?text=${encodeURIComponent(message)}`;
}
