const express = require('express');
const router = express.Router();
const {
  assistantChat,
  smartSearch,
  generateProductCopy,
  getOutfitBundle,
  summarizeReviews
} = require('../controllers/aiController');

router.post('/assistant', assistantChat);
router.post('/smart-search', smartSearch);
router.post('/generate-description', generateProductCopy);
router.get('/bundle/:productId', getOutfitBundle);
router.get('/review-summary/:productId', summarizeReviews);

module.exports = router;
