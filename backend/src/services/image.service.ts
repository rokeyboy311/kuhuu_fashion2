/**
 * Image Service — PostgreSQL Storage
 *
 * All images are stored directly in PostgreSQL as bytea columns.
 * Sharp is used server-side to:
 *  - Resize images to standard dimensions
 *  - Convert to WebP for optimized delivery
 *  - Generate thumbnails for product cards
 *
 * Images are served via GET /api/v1/images/:id
 * and GET /api/v1/images/:id/thumb
 */

import sharp from 'sharp';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export interface ProcessedImage {
  imageData: Buffer;  // Full-size WebP
  thumbnail: Buffer;  // Thumbnail WebP
  width: number;
  height: number;
  size: number;
  mimeType: 'image/webp';
}

class ImageService {
  /**
   * Process a product image:
   *  - Resize to max 1200×1500 (keeping aspect ratio)
   *  - Convert to WebP quality 85
   *  - Generate 400×500 thumbnail for cards
   */
  async processProductImage(buffer: Buffer): Promise<ProcessedImage> {
    try {
      // Full-size optimized WebP
      const full = await sharp(buffer)
        .resize(1200, 1500, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 4 })
        .toBuffer({ resolveWithObject: true });

      // Thumbnail for product cards
      const thumb = await sharp(buffer)
        .resize(400, 500, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      return {
        imageData: full.data,
        thumbnail: thumb,
        width: full.info.width,
        height: full.info.height,
        size: full.data.length,
        mimeType: 'image/webp',
      };
    } catch (error) {
      logger.error('Image processing failed:', error);
      throw new AppError('Image processing failed. Please upload a valid image.', 400);
    }
  }

  /**
   * Process a banner image:
   *  - Full: 1600×800 WebP
   *  - Thumbnail (mobile): 800×400 WebP
   */
  async processBannerImage(buffer: Buffer): Promise<ProcessedImage> {
    try {
      const full = await sharp(buffer)
        .resize(1600, 800, { fit: 'cover', position: 'center' })
        .webp({ quality: 88, effort: 4 })
        .toBuffer({ resolveWithObject: true });

      const thumb = await sharp(buffer)
        .resize(800, 400, { fit: 'cover', position: 'center' })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      return {
        imageData: full.data,
        thumbnail: thumb,
        width: full.info.width,
        height: full.info.height,
        size: full.data.length,
        mimeType: 'image/webp',
      };
    } catch (error) {
      logger.error('Banner image processing failed:', error);
      throw new AppError('Banner image processing failed.', 400);
    }
  }

  /**
   * Process an Instagram post image:
   *  - Square crop 800×800 WebP
   */
  async processInstagramImage(buffer: Buffer): Promise<ProcessedImage> {
    try {
      const full = await sharp(buffer)
        .resize(800, 800, { fit: 'cover', position: 'center' })
        .webp({ quality: 85, effort: 4 })
        .toBuffer({ resolveWithObject: true });

      const thumb = await sharp(buffer)
        .resize(300, 300, { fit: 'cover', position: 'center' })
        .webp({ quality: 75, effort: 4 })
        .toBuffer();

      return {
        imageData: full.data,
        thumbnail: thumb,
        width: full.info.width,
        height: full.info.height,
        size: full.data.length,
        mimeType: 'image/webp',
      };
    } catch (error) {
      logger.error('Instagram image processing failed:', error);
      throw new AppError('Image processing failed.', 400);
    }
  }

  /**
   * Process avatar / profile image:
   *  - Square crop 300×300 WebP
   */
  async processAvatarImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(300, 300, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (error) {
      throw new AppError('Avatar processing failed.', 400);
    }
  }

  /**
   * Validate that a file is actually an image
   */
  async validateImage(buffer: Buffer): Promise<void> {
    try {
      const metadata = await sharp(buffer).metadata();
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif'];
      if (!metadata.format || !allowedFormats.includes(metadata.format)) {
        throw new AppError('Invalid image format. Supported: JPEG, PNG, WebP, GIF', 400);
      }
      // Max original size: 20MB
      if (buffer.length > 20 * 1024 * 1024) {
        throw new AppError('Image too large. Maximum size is 20MB.', 400);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('File is not a valid image.', 400);
    }
  }
}

export default new ImageService();
