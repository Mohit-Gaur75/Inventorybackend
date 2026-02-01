const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/shop', shopRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/product', productRoutes);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('GramKart Backend Running 🚀');
});

module.exports = app;
