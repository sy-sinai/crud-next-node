const Item = require('../models/Item');

// Todos los ítems
exports.getAllItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Item.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear ítem
exports.createItem = async (req, res) => {
  try {
    const { name, description, category, ...customFields } = req.body;
    const newItem = new Item({ name, description, category, customFields });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar ítem
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar ítem
exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ítem eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};