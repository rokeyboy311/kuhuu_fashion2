import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/toggle', authenticate, wishlistController.toggleWishlist);
router.delete('/:productId', authenticate, wishlistController.removeFromWishlist);

export default router;
