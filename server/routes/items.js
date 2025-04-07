const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');
const auth = require('../middleware/auth'); // Importa el middleware
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemsController');

// Todas estas rutas ahora requieren autenticación
router.get('/', auth, itemsController.getAllItems);
router.post('/', auth, itemsController.createItem);
router.put('/:id', auth, itemsController.updateItem);
router.delete('/:id', auth, itemsController.deleteItem);

module.exports = router;