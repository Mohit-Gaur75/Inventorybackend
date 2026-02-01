// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const { protect } = require('../middlewares/authMiddleware');
// const { retailerOnly } = require('../middlewares/roleMiddleware');

// // CORRECT: Pass a function as handler
// router.get('/all', protect, retailerOnly, async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch products' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { protect } = require('../middlewares/authMiddleware');
const { buyerOnly } = require('../middlewares/roleMiddleware');

// SEARCH PRODUCTS BY NAME (for buyer)
router.get('/search', protect, buyerOnly, async (req, res) => {
  try {
    const name = req.query.name || '';
    const products = await Product.find({ name: { $regex: name, $options: 'i' } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search products' });
  }
});

// CHECK PRODUCT AVAILABILITY
router.get('/:id/availability', protect, buyerOnly, async (req, res) => {
  try {
    const productId = req.params.id;

    const inventory = await Inventory.find({ product: productId, stock: { $gt: 0 } })
      .populate('shop', 'shopName location');

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get availability' });
  }
});

module.exports = router;
