const express = require('express');
const router = express.Router();

const {
  searchProduct,
  getProductAvailability,
  searchShop,
  viewShopInventory
} = require('../controllers/buyerController');

const { protect } = require('../middlewares/authMiddleware');

// Buyer must be logged in (read-only)
router.get('/products/search', protect, searchProduct);
router.get('/products/:productId/availability', protect, getProductAvailability);
router.get('/shops/search', protect, searchShop);
router.get('/shops/:shopId/inventory', protect, viewShopInventory);

module.exports = router;
