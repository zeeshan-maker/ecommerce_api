const express = require('express');
const router = express.Router();
const upload = require("../utils/multerConfig")
const { createProduct, getAllProduct, getProductById, deleteProduct} = require("../controllers/productController");
const authenticate = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

router.post("/",authenticate,isAdmin,upload.single("image"),createProduct)
router.get("/",getAllProduct);
router.get("/:product_id",getProductById);
router.delete('/:product_id',authenticate, isAdmin, deleteProduct);



module.exports = router;