const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (customerId) {
      query.customer = customerId;
    }

    const bills = await Bill.find(query)
      .populate('customer', 'name email phone')
      .populate('createdBy', 'username fullName')
      .populate('items.product', 'name productId')
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single bill
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('customer')
      .populate('createdBy', 'username fullName')
      .populate('items.product');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create bill
exports.createBill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, customer, taxRate, discount, paymentMethod } = req.body;

    // Validate and update stock for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }

    // Create bill
    const billData = {
      items: items.map(item => ({
        product: item.product,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      customer: customer || null,
      taxRate: taxRate || 0,
      discount: discount || 0,
      paymentMethod: paymentMethod || 'cash',
      createdBy: req.user._id
    };

    const bill = new Bill(billData);
    await bill.save();

    // Update stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update customer stats if customer exists
    if (customer) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: {
          totalPurchases: 1,
          totalSpent: bill.total
        }
      });
    }

    const populatedBill = await Bill.findById(bill._id)
      .populate('customer')
      .populate('createdBy', 'username fullName')
      .populate('items.product');

    res.status(201).json(populatedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete bill (Admin only)
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Restore stock
    for (const item of bill.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Update customer stats if customer exists
    if (bill.customer) {
      await Customer.findByIdAndUpdate(bill.customer, {
        $inc: {
          totalPurchases: -1,
          totalSpent: -bill.total
        }
      });
    }

    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales statistics
exports.getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchQuery = {};

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await Bill.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalBills: { $sum: 1 },
          averageBill: { $avg: '$total' },
          totalTax: { $sum: '$taxAmount' },
          totalDiscount: { $sum: '$discount' }
        }
      }
    ]);

    const topProducts = await Bill.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: stats[0] || {
        totalRevenue: 0,
        totalBills: 0,
        averageBill: 0,
        totalTax: 0,
        totalDiscount: 0
      },
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

