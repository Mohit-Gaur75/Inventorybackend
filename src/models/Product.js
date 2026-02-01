const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'litre', 'piece', 'pcs'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
