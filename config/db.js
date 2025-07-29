const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
   dialect: process.env.DB_dialect,
   dialectOptions: {
      ssl: {
        require: true,              // Render ke liye required
        rejectUnauthorized: false   // Self-signed certs allow
      }
    }
  }

);

module.exports = sequelize;