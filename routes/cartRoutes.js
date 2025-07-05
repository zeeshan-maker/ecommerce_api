const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart,updateCartItem, clearCart } = require('../controllers/cartController');
const authenticate  = require('../middleware/auth');


router.post('/', authenticate, addToCart);
router.get("/",authenticate,getCart);
router.delete('/:cartItem_id', authenticate, removeFromCart);
router.put("/:item_id", authenticate,updateCartItem);
router.delete("/", authenticate, clearCart);
module.exports = router;