const Shop = require('../models/Shop');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// SEARCH PRODUCT (by name)
exports.searchProduct = async (req, res) => {
  try {
    const { name } = req.query;

    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Product search failed' });
  }
};

// GET SHOPS HAVING A PRODUCT
exports.getProductAvailability = async (req, res) => {
  try {
    const productId = req.params.productId;

    const inventory = await Inventory.find({
      product: productId,
      stock: { $gt: 0 }
    })
      .populate('shop', 'shopName address contact')
      .populate('product', 'name unit');

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Availability fetch failed' });
  }
};

// SEARCH SHOP BY NAME
exports.searchShop = async (req, res) => {
  try {
    const { name } = req.query;

    const shops = await Shop.find({
      shopName: { $regex: name, $options: 'i' }
    });

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Shop search failed' });
  }
};

// VIEW SHOP INVENTORY
exports.viewShopInventory = async (req, res) => {
  try {
    const shopId = req.params.shopId;

    const inventory = await Inventory.find({
      shop: shopId,
      stock: { $gt: 0 }
    })
      .populate('product', 'name category unit');

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Shop inventory fetch failed' });
  }
};
