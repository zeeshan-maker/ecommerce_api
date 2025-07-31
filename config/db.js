const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
   process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASSWORD,
  {
     host: process.env.DB_HOST, 
    dialect: process.env.DB_dialect, 
    logging: false,
  }

);



sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Database connection error:", error));

module.exports = sequelize;