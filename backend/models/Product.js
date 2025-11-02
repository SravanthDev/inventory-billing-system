const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate productId before validation
productSchema.pre('validate', async function(next) {
  if (!this.productId) {
    const count = await mongoose.model('Product').countDocuments();
    this.productId = `PROD${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
