import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create super admin
  const adminHash = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kuhuufashion.com' },
    update: {},
    create: {
      firstName: 'Kuhuu',
      lastName: 'Admin',
      email: 'admin@kuhuufashion.com',
      passwordHash: adminHash,
      role: Role.SUPER_ADMIN,
      isVerified: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'new-arrivals' },
      update: {},
      create: { name: 'New Arrivals', slug: 'new-arrivals', sortOrder: 1, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'dresses' },
      update: {},
      create: { name: 'Dresses', slug: 'dresses', sortOrder: 2, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'tops' },
      update: {},
      create: { name: 'Tops', slug: 'tops', sortOrder: 3, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'bottoms' },
      update: {},
      create: { name: 'Bottoms', slug: 'bottoms', sortOrder: 4, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'ethnic-wear' },
      update: {},
      create: { name: 'Ethnic Wear', slug: 'ethnic-wear', sortOrder: 5, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'western-wear' },
      update: {},
      create: { name: 'Western Wear', slug: 'western-wear', sortOrder: 6, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: { name: 'Accessories', slug: 'accessories', sortOrder: 7, isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: 'sale' },
      update: {},
      create: { name: 'Sale', slug: 'sale', sortOrder: 8, isActive: true },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Create collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'best-sellers' },
      update: {},
      create: { name: 'Best Sellers', slug: 'best-sellers', isFeatured: true, sortOrder: 1 },
    }),
    prisma.collection.upsert({
      where: { slug: 'summer-collection' },
      update: {},
      create: { name: 'Summer Collection', slug: 'summer-collection', isFeatured: true, sortOrder: 2 },
    }),
    prisma.collection.upsert({
      where: { slug: 'festive-edit' },
      update: {},
      create: { name: 'Festive Edit', slug: 'festive-edit', isFeatured: false, sortOrder: 3 },
    }),
  ]);
  console.log(`✅ ${collections.length} collections created`);

  // Create sample product
  const dressCategory = categories.find((c) => c.slug === 'dresses')!;
  const sampleProduct = await prisma.product.upsert({
    where: { slug: 'floral-summer-dress' },
    update: {},
    create: {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description:
        'A beautiful floral print summer dress crafted from lightweight breathable fabric. Perfect for casual outings, brunches, and beach trips.',
      shortDesc: 'Lightweight floral print dress — perfect for summer.',
      categoryId: dressCategory.id,
      brand: 'Kuhuu Fashion',
      tags: ['summer', 'floral', 'dress', 'casual'],
      basePrice: 1499,
      compareAtPrice: 1999,
      taxRate: 5,
      isNew: true,
      isFeatured: true,
      status: ProductStatus.ACTIVE,
      fabricDetails: '100% Cotton',
      careInstructions: 'Machine wash cold, gentle cycle',
      countryOfOrigin: 'India',
      variants: {
        create: [
          { sku: 'KF-FSD-S', size: 'S', color: 'Floral Pink', colorHex: '#FFB6C1', price: 1499, compareAtPrice: 1999, stock: 15, isDefault: true },
          { sku: 'KF-FSD-M', size: 'M', color: 'Floral Pink', colorHex: '#FFB6C1', price: 1499, compareAtPrice: 1999, stock: 20 },
          { sku: 'KF-FSD-L', size: 'L', color: 'Floral Pink', colorHex: '#FFB6C1', price: 1499, compareAtPrice: 1999, stock: 12 },
          { sku: 'KF-FSD-XL', size: 'XL', color: 'Floral Pink', colorHex: '#FFB6C1', price: 1499, compareAtPrice: 1999, stock: 8 },
        ],
      },
    },
    include: { variants: true },
  });

  // Create inventory records for sample product
  await prisma.inventory.createMany({
    data: sampleProduct.variants.map((v) => ({
      productId: sampleProduct.id,
      variantId: v.id,
      stock: v.stock,
    })),
    skipDuplicates: true,
  });
  console.log(`✅ Sample product created: ${sampleProduct.name}`);

  // Create welcome coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 999,
      maxDiscount: 300,
      isFirstOrderOnly: true,
      maxUsagePerUser: 1,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      description: 'Free shipping on any order',
      discountType: 'FREE_SHIPPING',
      discountValue: 0,
      isFreeShipping: true,
      maxUsagePerUser: 3,
      isActive: true,
    },
  });
  console.log('✅ Sample coupons created');

  // Create announcement bar
  await prisma.announcementBar.create({
    data: {
      text: '✨ FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE WELCOME10 FOR 10% OFF YOUR FIRST ORDER',
      bgColor: '#000000',
      textColor: '#FFFFFF',
      isActive: true,
    },
  });
  console.log('✅ Announcement bar created');

  // Create homepage banner
  await prisma.banner.create({
    data: {
      title: 'NEW COLLECTION',
      subtitle: 'Elevate Your Everyday Style',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
      link: '/shop',
      buttonText: 'SHOP NOW',
      isActive: true,
      sortOrder: 1,
    },
  });
  console.log('✅ Homepage banner created');

  // Store settings
  const settings = [
    { key: 'free_shipping_threshold', value: '999', group: 'shipping' },
    { key: 'cod_enabled', value: 'true', group: 'payment' },
    { key: 'cod_min_order', value: '0', group: 'payment' },
    { key: 'cod_max_order', value: '5000', group: 'payment' },
    { key: 'cod_charge', value: '49', group: 'payment' },
    { key: 'low_stock_threshold', value: '10', group: 'inventory' },
    { key: 'tax_rate', value: '5', group: 'tax' },
    { key: 'currency', value: 'INR', group: 'store' },
    { key: 'store_name', value: 'Kuhuu Fashion', group: 'store' },
    { key: 'instagram_handle', value: '@kuhuu_fashion', group: 'social' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Store settings created');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`\n📧 Admin login: admin@kuhuufashion.com`);
  console.log(`🔑 Admin password: Admin@123456`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
