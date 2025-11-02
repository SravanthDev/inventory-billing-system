const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_billing');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = new User({
      username: 'admin',
      email: 'admin@inventory.com',
      password: 'admin123',
      role: 'admin',
      fullName: 'Admin User'
    });

    const staff = new User({
      username: 'staff',
      email: 'staff@inventory.com',
      password: 'staff123',
      role: 'staff',
      fullName: 'Staff User'
    });

    await admin.save();
    await staff.save();
    console.log('Created users');

    // Create products
    const products = [
      {
        name: 'Laptop Dell XPS 15',
        category: 'Electronics',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 89999,
        stock: 15,
        reorderLevel: 5,
        productId: 'PROD00001'
      },
      {
        name: 'Wireless Mouse',
        category: 'Electronics',
        description: 'Ergonomic wireless mouse with USB receiver',
        price: 1299,
        stock: 50,
        reorderLevel: 20,
        productId: 'PROD00002'
      },
      {
        name: 'Mechanical Keyboard',
        category: 'Electronics',
        description: 'RGB backlit mechanical keyboard',
        price: 4999,
        stock: 30,
        reorderLevel: 10,
        productId: 'PROD00003'
      },
      {
        name: 'Office Chair',
        category: 'Furniture',
        description: 'Ergonomic office chair with lumbar support',
        price: 8999,
        stock: 25,
        reorderLevel: 10,
        productId: 'PROD00004'
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        description: 'LED desk lamp with adjustable brightness',
        price: 1999,
        stock: 8,
        reorderLevel: 10,
        productId: 'PROD00005'
      },
      {
        name: 'Monitor 27 inch',
        category: 'Electronics',
        description: '4K Ultra HD monitor with HDMI and USB-C',
        price: 24999,
        stock: 12,
        reorderLevel: 5,
        productId: 'PROD00006'
      },
      {
        name: 'USB-C Cable',
        category: 'Accessories',
        description: 'Fast charging USB-C cable 2 meters',
        price: 499,
        stock: 100,
        reorderLevel: 50,
        productId: 'PROD00007'
      },
      {
        name: 'Webcam HD',
        category: 'Electronics',
        description: '1080p HD webcam with microphone',
        price: 3499,
        stock: 20,
        reorderLevel: 10,
        productId: 'PROD00008'
      },
      {
        name: 'Notebook Set',
        category: 'Stationery',
        description: 'Premium notebook set of 5',
        price: 699,
        stock: 75,
        reorderLevel: 30,
        productId: 'PROD00009'
      },
      {
        name: 'Pen Set',
        category: 'Stationery',
        description: 'Premium ballpoint pen set',
        price: 399,
        stock: 60,
        reorderLevel: 25,
        productId: 'PROD00010'
      }
    ];

    await Product.insertMany(products);
    console.log('Created products');

    // Create customers
    const customers = [
      {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        customerId: 'CUST00001'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+0987654321',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        customerId: 'CUST00002'
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1122334455',
        address: '789 Pine Road',
        city: 'Chicago',
        customerId: 'CUST00003'
      }
    ];

    await Customer.insertMany(customers);
    console.log('Created customers');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin - Username: admin, Password: admin123');
    console.log('Staff - Username: staff, Password: staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

