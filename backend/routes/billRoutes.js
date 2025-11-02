const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const billController = require('../controllers/billController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Validation rules
const billValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number')
];

// Routes
router.get('/', authenticate, billController.getAllBills);
router.get('/stats', authenticate, billController.getSalesStats);
router.get('/:id', authenticate, billController.getBillById);
router.post('/', authenticate, billValidation, billController.createBill);
router.delete('/:id', authenticate, isAdmin, billController.deleteBill);

module.exports = router;

