const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  minStock: { type: Number, required: true },
  expiry: { type: Date },
  supplier: { type: String },
  category: { type: String },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'], default: 'In Stock' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema); 