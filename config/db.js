const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL,
  {
    dialect: process.env.DB_dialect, 
     dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Important for Render SSL
      },
    }
  }

);



sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Database connection error:", error));

module.exports = sequelize;