const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
// const productImagePath = path.join(__dirname, "../uploads/product");
// if (!fs.existsSync(productImagePath)) {
//   fs.mkdirSync(productImagePath, { recursive: true });
// }

// Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, productImagePath); // Store in /uploads/product/
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext); // e.g., 1718271234567.jpg
//   }
// });

// Optional: Validate file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const isValid = allowedTypes.test(file.mimetype);
//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// Export upload middleware
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temp folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
