import cloudinary from '../config/cloudinary';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

class CloudinaryService {
  async uploadProductImage(
    buffer: Buffer,
    options: {
      folder?: string;
      publicId?: string;
    } = {}
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'kuhuu-fashion/products',
          public_id: options.publicId,
          transformation: [
            { width: 1200, height: 1500, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
          ],
          eager: [
            { width: 400, height: 500, crop: 'fill', gravity: 'center', quality: 'auto', format: 'webp' },
            { width: 800, height: 1000, crop: 'fill', gravity: 'center', quality: 'auto', format: 'webp' },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) {
            logger.error('Cloudinary upload failed:', error);
            return reject(new AppError('Image upload failed', 500));
          }
          if (!result) return reject(new AppError('Upload returned no result', 500));

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      );

      stream.end(buffer);
    });
  }

  async uploadBannerImage(buffer: Buffer): Promise<UploadResult> {
    return this.uploadProductImage(buffer, { folder: 'kuhuu-fashion/banners' });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Cloudinary image deleted: ${publicId}`);
    } catch (error) {
      logger.error('Cloudinary delete failed:', error);
    }
  }

  getOptimizedUrl(
    publicId: string,
    options: { width?: number; height?: number; quality?: string } = {}
  ): string {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      crop: 'fill',
      quality: options.quality || 'auto',
      fetch_format: 'auto',
      secure: true,
    });
  }
}

export default new CloudinaryService();
