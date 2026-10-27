const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: { type: String, required: true },
      category: { type: String, required: true }, // e.g., "Shirts", "Pants"
      fabric: { type: String, required: true },   // e.g., "Cotton", "Linen"
      image: { type: String },                    // Product image save panna
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  // 🚨 STEP 1 DATA: Selected Delivery Address
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String, default: 'Home' }
  },
  //STEP 1 DATA: Full Shirt & Pant Measurements (Flexible)
  measurement: {
    profileName: { type: String, required: true },
    fitType: { type: String, default: 'Regular Fit' },
    height: { type: mongoose.Schema.Types.Mixed },
    
    // Shirt Fields
    neck: { type: mongoose.Schema.Types.Mixed },
    shoulder: { type: mongoose.Schema.Types.Mixed },
    chest: { type: mongoose.Schema.Types.Mixed },
    waist: { type: mongoose.Schema.Types.Mixed },
    hip: { type: mongoose.Schema.Types.Mixed },
    sleeveLength: { type: mongoose.Schema.Types.Mixed },
    armhole: { type: mongoose.Schema.Types.Mixed },
    bicep: { type: mongoose.Schema.Types.Mixed },
    wrist: { type: mongoose.Schema.Types.Mixed },
    shirtLength: { type: mongoose.Schema.Types.Mixed },

    // Pant Fields
    pantWaist: { type: mongoose.Schema.Types.Mixed },
    pantHip: { type: mongoose.Schema.Types.Mixed },
    thigh: { type: mongoose.Schema.Types.Mixed },
    knee: { type: mongoose.Schema.Types.Mixed },
    bottom: { type: mongoose.Schema.Types.Mixed },
    inseam: { type: mongoose.Schema.Types.Mixed },
    outseam: { type: mongoose.Schema.Types.Mixed },
    rise: { type: mongoose.Schema.Types.Mixed },
    pantLength: { type: mongoose.Schema.Types.Mixed },
    ankle: { type: mongoose.Schema.Types.Mixed }
  },
  // 🚨 STEP 2 DATA: Payment Details
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery (COD)'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  // 🚨 STEP 3 DATA: Order Total & Status
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveredAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);