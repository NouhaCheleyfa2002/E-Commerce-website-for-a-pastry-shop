import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.js';
import { userAuth } from '../middlewares/auth.js';

const wishlistRouter = express.Router();

wishlistRouter.get('/', userAuth, getWishlist);
wishlistRouter.post('/add', userAuth, addToWishlist);
wishlistRouter.delete('/remove/:productId', userAuth, removeFromWishlist);

export default wishlistRouter;
