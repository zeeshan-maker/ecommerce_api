const express= require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db')
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const productRoutes = require("./routes/porductRoutes")
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")
const stripeRoutes = require('./routes/stripeRoutes')




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));




app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);
app.use('/api/v1/stripe',stripeRoutes );
app.use('/api/v1/payments/webhook', require('./routes/webhook')); 



// Simple API
app.get('/', (req, res) => {
  res.send('Welcome to E-commerce application!');
});


sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.error("Database connection error:", error));

sequelize.sync({force: false}).then(()=>{
    app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
})


