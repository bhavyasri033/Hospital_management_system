const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Get all inventory items
router.get('/', inventoryController.getInventory);
// Get inventory item by ID
router.get('/:id', inventoryController.getInventoryById);
// Create new inventory item
router.post('/', inventoryController.createInventory);
// Update inventory item
router.put('/:id', inventoryController.updateInventory);
// Delete inventory item
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router; 