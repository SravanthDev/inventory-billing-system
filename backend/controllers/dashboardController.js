const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(thisMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Today's sales
    const todaySales = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly sales
    const monthlySales = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth, $lt: nextMonth }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
        }
      }
    ]);

    // Low stock products count
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$reorderLevel'] },
      isActive: true
    });

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Total customers
    const totalCustomers = await Customer.countDocuments();

    // Recent sales (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      todaySales: todaySales[0] || { revenue: 0, count: 0 },
      monthlySales: monthlySales[0] || { revenue: 0, count: 0 },
      inventoryValue: inventoryValue[0]?.totalValue || 0,
      lowStockCount,
      totalProducts,
      totalCustomers,
      dailySales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

