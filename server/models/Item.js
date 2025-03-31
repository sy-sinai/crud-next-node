// server/models/Item.js
const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, default: 'general' }, // 'películas', 'música', etc.
  customFields: mongoose.Schema.Types.Mixed // Objeto JSON para campos dinámicos
}, { timestamps: true });

module.exports = mongoose.model('Item', dynamicSchema);