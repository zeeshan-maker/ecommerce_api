const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
 {
  host: process.env.DB_HOST, // Database host
  dialect: process.env.DB_dialect, // Use PostgreSQL as the database dialect
  username:process.env.DB_USER , // Your PostgreSQL username
  password: process.env.DB_PASSWORD, // Your PostgreSQL password
  database: process.env.DB_NAME, // Your PostgreSQL database name
  
}
);

module.exports = sequelize;