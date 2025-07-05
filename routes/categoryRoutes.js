const express = require('express');
const router = express.Router();
const { createCategory, getAllCategory} = require('../controllers/categoryController');
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

router.post('/',authenticate,isAdmin, createCategory);
router.get('/',authenticate,isAdmin, getAllCategory);

module.exports = router;