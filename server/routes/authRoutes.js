const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updatePreferences,
  getAllUsers
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/preferences', protect, updatePreferences);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
