const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"),
    defaultValue: "PENDING"
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
    defaultValue: "PENDING"
  }
}, {
  tableName: "Order"
});

module.exports = Order;
