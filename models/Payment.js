const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
  payment_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM("COD", "ONLINE"),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
    defaultValue: "PENDING"
  },
  transation_id: {
    type: DataTypes.STRING
  }
}, {
  tableName: "Payment"
});

module.exports = Payment;
