const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { retailerOnly } = require('../middlewares/roleMiddleware');
const {
  addInventory,
  updateInventory,
  getMyInventory
} = require('../controllers/inventoryController');

// POST add inventory
router.post('/add', protect, retailerOnly, addInventory);

// PUT update inventory ✅ must be a function
router.put('/update/:id', protect, retailerOnly, updateInventory);

// GET my inventory
router.get('/my', protect, retailerOnly, getMyInventory);

module.exports = router;
