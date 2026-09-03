import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// Customer
router.post('/', authenticate, orderController.createOrder);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/my/:id', authenticate, orderController.getOrder);

// Admin
router.get(
  '/',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  orderController.getAllOrders
);
router.put(
  '/:id/status',
  authenticate,
  authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STAFF'),
  orderController.updateOrderStatus
);

export default router;
