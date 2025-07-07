const {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Shipping,
  Product,
} = require("../models/index");

exports.createOrder = async (req, res) => {
  const user_id = req.user.user_id;
  const { address, city, postalCode, country, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({
      where: { user_id },
      include: [{ model: CartItem, include: [Product] }],
    });
    if (!cart || cart.CartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Calculate total
    let total_amount = 0;
    cart.CartItems.forEach((item) => {
      total_amount += item.quantity * item.Product.price;
    });

    // Create order
    const order = await Order.create({ user_id, total_amount });

    // Create order items
    const orderItems = cart.CartItems.map((item) => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    // Create payment
    await Payment.create({
      order_id: order.order_id,
      payment_method: paymentMethod,
      payment_status: paymentMethod === "COD" ? "PENDING" : "PAID",
    });

    // Create shipping
    await Shipping.create({
      order_id: order.order_id,
      address,
      city,
      postal_code: postalCode,
      country,
    });

    // Clear cart
    await CartItem.destroy({ where: { cart_id: cart.cart_id } });

    // return res.status(201).json({ status:201, message: "Order placed successfully"});
    return res
      .status(201)
      .json({ message: "Order placed successfully", order_id: order.order_id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const orders = await Order.findAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          attributes: ["orderItem_id","quantity", "price"],
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "image", "price"],
            },
          ],
        },
        {
          model: Shipping,
          attributes: ["shipping_id","address","city","postal_code","country","status"]
        },
        {
          model: Payment,
          attributes: ["payment_id","payment_method","payment_status","transation_id"]
        }
      ],
    });
    return res.json({ message: "Fetch all order successfully.", orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const order_id = req.params.order_id;
  try {
    const order = await Order.findByPk(order_id, {
      include: [OrderItem, Shipping, Payment],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem, Shipping, Payment],
    });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const { status } = req.body;
    const order = await Order.findByPk(order_id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.json({ message: "Order status updated", order });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update status" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.user_id)
      return res.status(403).json({ message: "Unauthorized" });

    if (order.status !== "pending")
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
};
