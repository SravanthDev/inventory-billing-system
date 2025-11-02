const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/', authenticate, productController.getAllProducts);
router.get('/categories', authenticate, productController.getCategories);
router.get('/low-stock', authenticate, productController.getLowStockProducts);
router.get('/:id', authenticate, productController.getProductById);
router.post('/', authenticate, isAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productValidation, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;

