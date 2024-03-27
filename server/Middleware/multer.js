const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploaded files
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(null, file.originalname); // You can also customize the filename if needed
  }
});

// Multer file filter configuration (optional)
const fileFilter = (req, file, cb) => {
  // Check if the file type is allowed
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Unsupported file type'), false); // Reject the file
  }
};

// Initialize Multer middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;