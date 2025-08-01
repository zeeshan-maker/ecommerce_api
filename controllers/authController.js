const { User } = require("../models/index");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const generateTokens = require("../utils/generateTokens");
const { sendEmail } = require("../utils/emailSender");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await User.findOne({
      where: { [Op.or]: [{ email }, { phone }] },
    });

    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({
          status: 409,
          message: "Email already registered.",
        });
      }
      if (existing.phone === phone) {
        return res.status(409).json({
          status: 409,
          message: "Phone number already registered.",
        });
      }
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.create({ name, email, phone, password, resetToken: token });
    res.status(201).json({
      status: 201,
      message:
        "Registration successful. Please Check your email to verify your account.",
    });

    const link = `https://ecommerce-api-z44v.onrender.com/api/v1/auth/verify-user/${token}`;
    await sendEmail(
      email,
      "Use This Link to Activate Your Account",
      `Please verify your account.`,
      `<p>Click to verify: <a href="${link}">${link}</a></p>`
    );
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//user login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({
        status: 404,
        message: "User Not Found",
      });

    if (password !== user.password)
      return res
        .status(401)
        .json({ status: 401, message: "Invalid credentials" });

    if (!user.isVerified) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      await user.save();
      const link = `https://ecommerce-api-z44v.onrender.com/api/v1/auth/verify-user/${token}`;
      await sendEmail(
        email,
        "Use This Link to Activate Your Account",
        `Please verify your account.`,
        `<p>Click to verify: <a href="${link}">${link}</a></p>`
      );
      return res.status(201).json({
        status: 201,
        message: "Please Check your email to verify your account.",
      });
    }

    // Generate Tokens
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "User login successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {id:user.user_id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

exports.verifyUser = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user)
      return res.status(400).json({
        status: 400,
        message: "Invalid or expired token",
      });

    user.isVerified = true;
    user.resetToken = null;
    await user.save();
    return res.status(200).json({
      status: 200,
      message: "Email verified successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    await user.save();

    res.status(200).json({ status: 200, message: "Reset link sent to email" });
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendEmail(
      email,
      "Reset Your Password",
      `We received a request to reset your password. Click the button below to set a new password`,
      `<p style="text-align: center;">
                 <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>

            </p>
            <p style="text-align: center; margin-top: 20px;">Or copy this link: <br/> <a href="${resetLink}">${resetLink}</a></p>`
    );
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { resetToken: token } });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });
    user.password = newPassword;
    user.resetToken = null;
    await user.save();
    return res
      .status(200)
      .json({ status: 200, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: 500, serror: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const {refreshToken} = req.body;
  if (!refreshToken)
    return res
      .status(400)
      .json({ status: 400, message: "Refresh token required" });

  try {
    // Verify refresh token
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // make sure you use your refresh secret
    const user = await User.findByPk(payload.user_id);
    if (!user || user.refreshToken !== refreshToken)
      return res
        .status(403)
        .json({ status: 403, message: "Invalid refresh token" });
    // Generate new tokens
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({
        status: 401,
        message: "Token expired or invalid",
        error: error.message,
      });
  }
};

exports.sendEmail = async (req, res) => {
  const email = req.body.email;
  try {
    await sendEmail(
      email,
      "Use This Link to Activate Your Account",
      "Please verify your account.",
      `<p>Click to verify</p>`
    );

    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
