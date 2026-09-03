import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import imageService from '../services/image.service';
import slugify from 'slugify';
import { Prisma, ProductStatus } from '@prisma/client';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      collection,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      sort = 'createdAt:desc',
      isNew,
      isFeatured,
      isBestSeller,
      inStock,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      }),
      ...(isNew === 'true' && { isNew: true }),
      ...(isFeatured === 'true' && { isFeatured: true }),
      ...(isBestSeller === 'true' && { isBestSeller: true }),
      ...(collection && { collections: { some: { collection: { slug: collection } } } }),
      ...(inStock === 'true' && { variants: { some: { stock: { gt: 0 } } } }),
      variants: {
        some: {
          isActive: true,
          ...(size && { size }),
          ...(color && { color: { contains: color, mode: 'insensitive' } }),
          ...(minPrice || maxPrice
            ? {
                price: {
                  ...(minPrice && { gte: parseFloat(minPrice) }),
                  ...(maxPrice && { lte: parseFloat(maxPrice) }),
                },
              }
            : {}),
        },
      },
    };

    const [sortField, sortOrder] = sort.split(':');
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortField as keyof Prisma.ProductOrderByWithRelationInput]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { id: true, alt: true, width: true, height: true, isPrimary: true },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              size: true,
              color: true,
              colorHex: true,
              price: true,
              compareAtPrice: true,
              stock: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    paginatedResponse({ res, data: products, page: pageNum, limit: limitNum, total });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            alt: true,
            width: true,
            height: true,
            sortOrder: true,
            isPrimary: true,
            createdAt: true,
            // imageData & thumbnail are NOT included — served via /api/v1/images/:id
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { size: 'asc' },
        },
        collections: {
          include: { collection: { select: { id: true, name: true, slug: true } } },
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new NotFoundError('Product');
    }

    // Increment view count
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    successResponse({ res, data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      name,
      description,
      shortDesc,
      categoryId,
      brand,
      tags,
      basePrice,
      compareAtPrice,
      taxRate,
      weight,
      seoTitle,
      seoDesc,
      metaKeywords,
      fabricDetails,
      careInstructions,
      countryOfOrigin,
      isNew,
      isFeatured,
      isBestSeller,
      status,
      variants,
      collectionIds,
    } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        categoryId,
        brand,
        tags: tags || [],
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        taxRate: parseFloat(taxRate || '0'),
        weight: weight ? parseFloat(weight) : null,
        seoTitle,
        seoDesc,
        metaKeywords: metaKeywords || [],
        fabricDetails,
        careInstructions,
        countryOfOrigin: countryOfOrigin || 'India',
        isNew: isNew === true || isNew === 'true',
        isFeatured: isFeatured === true || isFeatured === 'true',
        isBestSeller: isBestSeller === true || isBestSeller === 'true',
        status: status || ProductStatus.DRAFT,
        variants: variants
          ? {
              create: variants.map((v: {
                sku: string;
                size?: string;
                color?: string;
                colorHex?: string;
                price: number;
                compareAtPrice?: number;
                stock?: number;
                isDefault?: boolean;
              }) => ({
                sku: v.sku,
                size: v.size,
                color: v.color,
                colorHex: v.colorHex,
                price: parseFloat(String(v.price)),
                compareAtPrice: v.compareAtPrice ? parseFloat(String(v.compareAtPrice)) : null,
                stock: parseInt(String(v.stock || '0'), 10),
                isDefault: v.isDefault || false,
              })),
            }
          : undefined,
        collections: collectionIds
          ? {
              create: collectionIds.map((cid: string) => ({ collectionId: cid })),
            }
          : undefined,
      },
      include: {
        variants: true,
        category: true,
        images: true,
      },
    });

    // Create inventory records for each variant
    if (product.variants.length > 0) {
      await prisma.inventory.createMany({
        data: product.variants.map((v) => ({
          productId: product.id,
          variantId: v.id,
          stock: v.stock,
        })),
        skipDuplicates: true,
      });
    }

    createdResponse({ res, data: product, message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updates,
      include: { variants: true, images: true, category: true },
    });

    successResponse({ res, data: product, message: 'Product updated' });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
    });
    successResponse({ res, message: 'Product archived' });
  } catch (error) {
    next(error);
  }
}

export async function uploadProductImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new NotFoundError('No files uploaded');
    }

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await imageService.validateImage(file.buffer);
      const processed = await imageService.processProductImage(file.buffer);

      const image = await prisma.productImage.create({
        data: {
          productId: id,
          imageData: processed.imageData,
          thumbnail: processed.thumbnail,
          mimeType: processed.mimeType,
          width: processed.width,
          height: processed.height,
          size: processed.size,
          alt: req.body.alt || '',
          sortOrder: i,
          isPrimary: i === 0,
        },
        select: {
          id: true,
          productId: true,
          mimeType: true,
          width: true,
          height: true,
          size: true,
          alt: true,
          sortOrder: true,
          isPrimary: true,
          createdAt: true,
        },
      });

      results.push({
        ...image,
        url: `/api/v1/images/${image.id}`,
        thumbUrl: `/api/v1/images/${image.id}/thumb`,
      });
    }

    successResponse({ res, data: results, message: 'Images uploaded and stored in database' });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { categoryId: true, id: true },
    });

    if (!product) throw new NotFoundError('Product');

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: ProductStatus.ACTIVE,
      },
      take: 8,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, select: { price: true, compareAtPrice: true, stock: true } },
      },
    });

    successResponse({ res, data: related });
  } catch (error) {
    next(error);
  }
}
