const {Category} = require('../models/index');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await Category.create({ name });
   return res.status(201).json({
        status:201,
        message:"Create category successfully."
    });
  } 
  catch (error) {
     return res.status(500).json({ 
        status:500,
        message: 'Error creating category', 
        error: error.message 
    });
  }
};

exports.getAllCategory = async (req,res)=>{
   try {
    const category = await Category.findAll();
    return res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
}
