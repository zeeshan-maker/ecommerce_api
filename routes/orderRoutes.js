const express = require('express');
const router = express.Router();
const { createOrder,getUserOrders,getOrderById, getAllOrders,updateOrderStatus} = require('../controllers/orderController');
const  authenticate  = require('../middleware/auth');
const isAdmin = require("../middleware/admin");

router.post('/', authenticate, createOrder);
router.get("/", authenticate,getUserOrders);
router.get("/:order_id", authenticate, getOrderById);
router.get("/admin/all", getAllOrders);
router.patch("/admin/status/:order_id", authenticate, isAdmin, updateOrderStatus);
// router.put("/cancel/:id", authenticate, orderController.cancelOrder);

module.exports = router;
