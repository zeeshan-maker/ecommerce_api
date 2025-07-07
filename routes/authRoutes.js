const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyUser,
  logout,
  forgotPassword,
  resetPassword,
  sendEmail,
  refreshToken
} = require("../controllers/authController");
const authenticate = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-user/:token", verifyUser);
router.post("/logout", authenticate, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/sent-email", sendEmail);
router.post("/refresh-token", refreshToken)

module.exports = router;
