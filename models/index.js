const User= require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Category = require("./Category");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const Shipping = require("./Shipping");

//  USER
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });


// 🛒 CART & CART ITEMS
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

CartItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });


// 📦 PRODUCT & CATEGORY

Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE'});
Product.belongsTo(Category, { foreignKey: 'category_id',  });

// 📬 ORDER
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// 💳 PAYMENT
Order.hasOne(Shipping, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });


// 🚚 SHIPPING
Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Shipping.belongsTo(Order, { foreignKey: 'order_id' });







module.exports ={
    User,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Category,
    Product,
    Payment,
    Shipping
}