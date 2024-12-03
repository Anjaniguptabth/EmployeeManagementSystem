const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

const router = express.Router();

// Multer configuration for file storage and file validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
    }
    cb(null, uploadDir); // Define the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const filename = Date.now() + (fileExtension === '.png' ? '.png' : '.jpg');
    cb(null, filename); // Generate unique filename with the correct extension
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size of 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and JPEG files are allowed'), false);
    }
    cb(null, true);
  },
}).single('f_Image'); // Expecting a single file with field name 'f_Image'

// Routes for employee CRUD operations

// Get all employees
router.get('/', getAllEmployees);

// Get an employee by ID
router.get('/:id', getEmployeeById);

// Create a new employee with image upload
router.post('/', (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next(); // Proceed to the next middleware (createEmployee)
  });
}, createEmployee);

// Update an employee by ID with image upload
router.put('/:id', (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next(); // Proceed to the next middleware (updateEmployee)
  });
}, updateEmployee);

// Delete an employee by ID
router.delete('/:id', deleteEmployee);

module.exports = router;
