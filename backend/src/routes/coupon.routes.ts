import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Customer
router.post('/validate', authenticate, couponController.validateCoupon);

// Admin
router.get(
  '/',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  couponController.getCoupons
);
router.post(
  '/',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  couponController.createCoupon
);
router.put(
  '/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  couponController.updateCoupon
);
router.delete(
  '/:id',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  couponController.deleteCoupon
);

export default router;
