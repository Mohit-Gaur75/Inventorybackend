const express = require('express');
const router = express.Router();

const { createShop, getMyShop } = require('../controllers/shopController');
const { protect } = require('../middlewares/authMiddleware');
const { retailerOnly } = require('../middlewares/roleMiddleware');

router.post('/create', protect, retailerOnly, createShop);
router.get('/my-shop', protect, retailerOnly, getMyShop);

module.exports = router;
