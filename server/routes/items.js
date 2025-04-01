const express = require('express');
const router = express.Router();
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemsController');

router.get('/', getAllItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;