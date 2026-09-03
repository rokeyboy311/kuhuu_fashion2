import { Router } from 'express';
import * as imageController from '../controllers/image.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// ─── Public image serving routes ─────────────────────────────
// These return raw binary image data (WebP) from PostgreSQL

// Product images
router.get('/:id', imageController.getProductImage);
router.get('/:id/thumb', imageController.getProductImageThumb);

// Banner images
router.get('/banner/:id', imageController.getBannerImage);
router.get('/banner/:id/thumb', imageController.getBannerThumb);

// Instagram post images
router.get('/instagram/:id', imageController.getInstagramImage);
router.get('/instagram/:id/thumb', imageController.getInstagramImageThumb);

// ─── Admin upload routes ──────────────────────────────────────

// Upload product images (up to 10)
router.post(
  '/product/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  upload.array('images', 10),
  imageController.uploadProductImages
);

// Delete a product image
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  imageController.deleteProductImage
);

// Upload banner
router.post(
  '/banner',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'),
  imageController.uploadBannerImage
);

// Upload Instagram post
router.post(
  '/instagram',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'),
  imageController.uploadInstagramPost
);

export default router;
