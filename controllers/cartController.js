const {User,Cart,CartItem,Product, Category} = require('../models/index');

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.user_id;
  let quantity = 1;

  try {
    let cart = await Cart.findOne({ where: { user_id } });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    // Check if product already in cart
    let item = await CartItem.findOne({
      where: { cart_id: cart.cart_id, product_id }
    });

    if (item) {
      // Update quantity
      item.quantity += quantity;
      await item.save();
    } else {
      // Create new cart item
      await CartItem.create({
        cart_id: cart.cart_id,
        product_id,
        quantity
      });
    }

    return res.status(201).json({ status:201, message: 'Product added to cart successfully', cart});
  } catch (err) {
   return res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};


// ✅ Get Cart
exports.getCart = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const cart = await Cart.findOne({
      where: { user_id },
      include: [
        {
          model:CartItem,
          include:[
            {
              model:Product,
              include:[
                {
                  model:Category,
                  attributes:['name']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!cart) return res.json({ message: 'Cart is empty', CartItems: [] });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};


// ✅ Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  const { cartItem_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const cart = await Cart.findOne({ where: { user_id } });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const deleted = await CartItem.destroy({
      where: { cart_id: cart.cart_id, cartItem_id }
    });

    if (deleted === 0)
      return res.status(404).json({status:404, message: 'Product not found in cart' });

  return res.status(200).json({ status:200, message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({status:500, message: 'Error removing item', error: err.message });
  }
};


//  Update quantity
exports.updateCartItem = async (req, res) => {
  const { item_id } = req.params;
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByPk(item_id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await item.save();

   return res.status(200).json({message:"Update quantity successfully.",item});
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};



// Clear cart
exports.clearCart = async (req, res) => {
  const user_id=req.user.user_id;
  try {
    const cart = await Cart.findOne({ where: { user_id:user_id  } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cart_id: cart.cart_id } });
    return res.json({ message: "Cart cleared" });
  } 
  catch (err) {
    return res.status(500).json({ error: "Failed to clear cart" });
  }
};
