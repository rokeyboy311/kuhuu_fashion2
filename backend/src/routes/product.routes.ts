import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProduct);
router.get('/:slug/related', productController.getRelatedProducts);

// Admin only
router.post(
  '/',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  productController.createProduct
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  productController.updateProduct
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  productController.deleteProduct
);
router.post(
  '/:id/images',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  upload.array('images', 10),
  productController.uploadProductImages
);

export default router;
