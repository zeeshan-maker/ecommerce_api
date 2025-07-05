const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Shipping = sequelize.define("Shipping", {
  shipping_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
   address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SHIPPED", "DELIVERED"),
    defaultValue: "PENDING"
  }
}, {
  tableName: "Shipping"
});

module.exports = Shipping;
