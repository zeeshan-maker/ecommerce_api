const express = require('express');
const router = express.Router();
const { Order, OrderItem, Payment, Shipping, Cart, CartItem, Product } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const user_id = session.metadata.user_id;

    try {
      const cart = await Cart.findOne({
        where: { user_id },
        include: [{ model: CartItem, include: [Product] }],
      });

      if (!cart) return;

      const total_amount = cart.CartItems.reduce((sum, item) =>
        sum + item.quantity * item.Product.price, 0
      );

      const order = await Order.create({ user_id, total_amount });

      const orderItems = cart.CartItems.map((item) => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Product.price
      }));

      await OrderItem.bulkCreate(orderItems);

      await Payment.create({
        order_id: order.order_id,
        payment_method: 'Online',
        payment_status: 'SUCCESS',
        stripe_session_id: session.id
      });

      await Shipping.create({
        order_id: order.order_id,
        address: session.customer_details.address.line1,
        city: session.customer_details.address.city,
        postal_code: session.customer_details.address.postal_code,
        country: session.customer_details.address.country
      });

      await CartItem.destroy({ where: { cart_id: cart.cart_id } });

      console.log("✅ Order placed successfully via Stripe");

    } catch (err) {
      console.error("❌ Webhook order error:", err.message);
    }
  }

  res.status(200).send('Received');
});

module.exports = router;
