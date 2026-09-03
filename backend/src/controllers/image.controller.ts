/**
 * Image Controller
 *
 * Serves images stored as bytea in PostgreSQL.
 *
 * Routes:
 *   GET /api/v1/images/:id          — full-size product image
 *   GET /api/v1/images/:id/thumb    — thumbnail (for product cards)
 *   GET /api/v1/images/banner/:id   — full banner image
 *   GET /api/v1/images/banner/:id/thumb  — mobile banner
 *   GET /api/v1/images/instagram/:id     — Instagram post image
 *
 * Images are cached with Cache-Control headers to avoid
 * re-serving the same binary repeatedly from the DB.
 */

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import imageService from '../services/image.service';
import { NotFoundError } from '../utils/errors';

const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setImageHeaders(res: Response, mimeType: string): void {
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}, immutable`);
  res.setHeader('Vary', 'Accept');
}

// ─── Product Images ───────────────────────────────────────────

export async function getProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: req.params.id },
      select: { imageData: true, mimeType: true },
    });

    if (!image) throw new NotFoundError('Image');

    setImageHeaders(res, image.mimeType);
    res.send(image.imageData);
  } catch (error) {
    next(error);
  }
}

export async function getProductImageThumb(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: req.params.id },
      select: { thumbnail: true, mimeType: true },
    });

    if (!image) throw new NotFoundError('Image');

    setImageHeaders(res, image.mimeType);
    res.send(image.thumbnail);
  } catch (error) {
    next(error);
  }
}

// ─── Banner Images ────────────────────────────────────────────

export async function getBannerImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: req.params.id },
      select: { imageData: true, mimeType: true },
    });

    if (!banner) throw new NotFoundError('Banner');

    setImageHeaders(res, banner.mimeType);
    res.send(banner.imageData);
  } catch (error) {
    next(error);
  }
}

export async function getBannerThumb(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: req.params.id },
      select: { thumbnail: true, mimeType: true },
    });

    if (!banner) throw new NotFoundError('Banner');

    setImageHeaders(res, banner.mimeType);
    res.send(banner.thumbnail);
  } catch (error) {
    next(error);
  }
}

// ─── Instagram Post Images ────────────────────────────────────

export async function getInstagramImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.instagramPost.findUnique({
      where: { id: req.params.id },
      select: { imageData: true, mimeType: true },
    });

    if (!post) throw new NotFoundError('Post');

    setImageHeaders(res, post.mimeType);
    res.send(post.imageData);
  } catch (error) {
    next(error);
  }
}

export async function getInstagramImageThumb(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.instagramPost.findUnique({
      where: { id: req.params.id },
      select: { thumbnail: true, mimeType: true },
    });

    if (!post) throw new NotFoundError('Post');

    setImageHeaders(res, post.mimeType);
    res.send(post.thumbnail);
  } catch (error) {
    next(error);
  }
}

// ─── Upload Handlers (Admin) ──────────────────────────────────

export async function uploadProductImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params; // productId
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
        // Don't return binary data in the response
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

    res.status(201).json({
      success: true,
      message: `${results.length} image(s) uploaded and stored`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadBannerImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;
    if (!file) throw new NotFoundError('No file uploaded');

    await imageService.validateImage(file.buffer);
    const processed = await imageService.processBannerImage(file.buffer);

    const banner = await prisma.banner.create({
      data: {
        title: req.body.title || '',
        subtitle: req.body.subtitle,
        imageData: processed.imageData,
        thumbnail: processed.thumbnail,
        mimeType: processed.mimeType,
        link: req.body.link,
        buttonText: req.body.buttonText,
        isActive: req.body.isActive !== 'false',
        sortOrder: parseInt(req.body.sortOrder || '0', 10),
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        link: true,
        buttonText: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...banner,
        imageUrl: `/api/v1/images/banner/${banner.id}`,
        thumbUrl: `/api/v1/images/banner/${banner.id}/thumb`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadInstagramPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;
    if (!file) throw new NotFoundError('No file uploaded');

    await imageService.validateImage(file.buffer);
    const processed = await imageService.processInstagramImage(file.buffer);

    const post = await prisma.instagramPost.create({
      data: {
        instagramId: req.body.instagramId,
        imageData: processed.imageData,
        thumbnail: processed.thumbnail,
        mimeType: processed.mimeType,
        link: req.body.link,
        caption: req.body.caption,
        isActive: true,
        sortOrder: parseInt(req.body.sortOrder || '0', 10),
      },
      select: {
        id: true,
        instagramId: true,
        link: true,
        caption: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...post,
        imageUrl: `/api/v1/images/instagram/${post.id}`,
        thumbUrl: `/api/v1/images/instagram/${post.id}/thumb`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.productImage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
}
