import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public
router.get('/product/:productId', reviewController.getProductReviews);

// Customer
router.post('/product/:productId', authenticate, reviewController.createReview);

// Admin
router.get(
  '/pending',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  reviewController.getPendingReviews
);
router.put(
  '/:id/moderate',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  reviewController.moderateReview
);

export default router;
