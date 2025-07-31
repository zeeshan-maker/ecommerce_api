const {Product, Category} = require("../models/index");
const path = require("path");
const fs = require("fs")
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file?.filename;
       
 
  try {

     // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "product", // Cloudinary folder name
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

     // Validate category
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ 
        status:400,
        message: "Invalid category" 
      });
    }
    await Product.create({name,description,price,stock,category_id,image:result.secure_url})
    return res.status(201).json({status:201,message:"Product created successfully."});
    
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};



exports.getAllProduct = async (req,res)=>{
   try {
    const products = await Product.findAll({
      include: [{ model: Category }]
    });
    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
}


exports.getProductById = async (req,res)=>{
  const product_id = req.params.product_id;
   try {
    const product = await Product.findByPk(product_id,{
      include: [{ model: Category }]
    });

    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
}


exports.deleteProduct = async (req, res) => {
  const product_id = req.params.product_id;

  try {
    // Step 1: Find product
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: 'Product not found'
      });
    }

    // Step 2: Delete image file (if exists)
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Step 3: Delete product
    await product.destroy();

    return res.status(200).json({
      status: 200,
      message: 'Product deleted successfully.'
    });

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'Error deleting product',
      error: err.message
    });
  }
};







