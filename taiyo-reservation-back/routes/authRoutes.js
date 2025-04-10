const express = require('express');
const { register, login, resetPassword, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user and get JWT token
router.post('/login', login);

router.post('/logout', logout);

router.post('/password-reset', resetPassword);


module.exports = router;
