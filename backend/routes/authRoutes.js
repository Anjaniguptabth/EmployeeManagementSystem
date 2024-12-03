// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /auth/login - User login route
router.post('/login', login);

module.exports = router;
