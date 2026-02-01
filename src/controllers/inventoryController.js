const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Shop = require('../models/Shop');

// --- ADD PRODUCT TO INVENTORY ---
exports.addInventory = async (req, res) => {
  try {
    const { productName, category = 'General', unit = 'pcs', price, stock } = req.body;
    const retailerId = req.user.id;

    // Validate inputs
    if (!productName || productName.trim() === '') {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
    }

    if (!stock || isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a valid number' });
    }

    // Find the retailer's shop
    const shop = await Shop.findOne({ owner: retailerId });
    if (!shop) {
      return res.status(400).json({ message: 'You must create a shop first' });
    }

    // Check if product exists, else create
    let product = await Product.findOne({ name: productName.trim() });
    if (!product) {
      product = new Product({ 
        name: productName.trim(), 
        category: category || 'General', 
        unit: unit || 'pcs' 
      });
      await product.save();
    }

    // Check if inventory already exists
    const existingInventory = await Inventory.findOne({ shop: shop._id, product: product._id });
    if (existingInventory) {
      return res.status(400).json({ message: 'Product already in inventory for this shop, use update instead' });
    }

    // Create inventory entry with proper type conversion
    const inventory = await Inventory.create({
      shop: shop._id,
      product: product._id,
      price: parseFloat(price),
      stock: parseInt(stock)
    });

    // Populate the response
    await inventory.populate('product', 'name category unit');

    res.status(201).json({ 
      message: 'Product added to inventory successfully', 
      inventory 
    });

  } catch (error) {
    console.error('Add Inventory Error:', error);
    res.status(500).json({ 
      message: 'Failed to add product: ' + (error.message || 'Unknown error'),
      error: error.message 
    });
  }
};

// --- UPDATE STOCK / PRICE ---
exports.updateInventory = async (req, res) => {
  try {
    const { price, stock } = req.body;
    const { id } = req.params;

    const inventory = await Inventory.findById(id);
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });

    inventory.price = price ?? inventory.price;
    inventory.stock = stock ?? inventory.stock;

    await inventory.save();

    res.json({ message: 'Inventory updated', inventory });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update failed', error });
  }
};

// --- GET MY INVENTORY ---
exports.getMyInventory = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const inventory = await Inventory.find({ shop: shop._id })
      .populate('product', 'name category unit');

    res.json(inventory);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch inventory', error });
  }
};
