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
const http = require('http'); 
const { Server } = require('socket.io');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // replace with your frontend URL in production
    methods: ['GET', 'POST']
  }
});
// ✅ Socket.io user mapping
const connectedUsers = {};

// ✅ Socket.io handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (let userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
  });

  // Export io and connectedUsers to use in controllers
app.set('io', io);
app.set('connectedUsers', connectedUsers);

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
    server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
})


