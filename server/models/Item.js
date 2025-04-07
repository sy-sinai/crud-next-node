const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general' },
  customFields: { type: Object, default: {} } // Campos dinámicos
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);