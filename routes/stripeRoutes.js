// routes/stripeRoutes.js
const express = require('express');
const { createStripeSession } = require('../controllers/stripeController');
const authenticate = require("../middleware/auth")

const router = express.Router();
router.post('/create-stripe-session', authenticate, createStripeSession);
module.exports = router;
