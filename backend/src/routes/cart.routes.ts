import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartController.addToCart);
router.put('/:id', authenticate, cartController.updateCartItem);
router.delete('/clear', authenticate, cartController.clearCart);
router.delete('/:id', authenticate, cartController.removeFromCart);

export default router;
