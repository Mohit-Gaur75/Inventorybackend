const Shop = require('../models/Shop');

// CREATE SHOP
exports.createShop = async (req, res) => {
  try {
    const { shopName, address, contact } = req.body;

    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({ message: 'Shop already exists' });
    }

    const shop = await Shop.create({
      shopName,
      address,
      contact,
      owner: req.user.id
    });

    res.status(201).json({
      message: 'Shop created successfully',
      shop
    });
  } catch (error) {
    res.status(500).json({ message: 'Shop creation failed', error });
  }
};

// GET MY SHOP
exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shop' });
  }
};
