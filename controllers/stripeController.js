// controllers/stripeController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Cart, CartItem, Product } = require("../models/index");

exports.createStripeSession = async (req, res) => {
  const user_id = req.user.user_id;
  const { address, city, postalCode, country, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({
      where: { user_id },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.CartItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );

    if (totalAmount < 42) {
      return res
        .status(400)
        .json({ message: "Minimum order value for online payment is ₹42." });
    }

    const line_items = cart.CartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.Product.name,
        },
        unit_amount: item.Product.price * 100, // ₹ to paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/payment-success?address=${address}&city=${city}&postalCode=${postalCode}&country=${country}&paymentMethod=${paymentMethod}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    return res.status(200).json({ url: session.url });
  
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
