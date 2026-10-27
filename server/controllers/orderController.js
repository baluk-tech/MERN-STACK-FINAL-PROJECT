const mongoose = require('mongoose');
const Order = require('../models/Order');

// ==========================================
// 1. CREATE NEW ORDER (Amazon 3-Step Checkout)
// ==========================================
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { 
      cartItems, 
      totalAmount, 
      shippingAddress, 
      measurement, 
      paymentMethod 
    } = req.body;

    // Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in checkout!' });
    }
    if (!shippingAddress || !measurement) {
      return res.status(400).json({ message: 'Shipping address and measurement are required!' });
    }

    // Items-a Order Schema format-ku map pandrom
    const formattedItems = cartItems.map((item) => ({
      product: item._id,
      title: item.title,
      category: item.category || 'General',
      fabric: item.fabric || item.material || 'Standard Cotton',
      image: item.image || '',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price)
    }));

    // UPI / Card na Paid nu vechikalam (Demo-ku), COD na Pending
    const isOnlinePayment = paymentMethod && !paymentMethod.includes('COD') && !paymentMethod.includes('Cash');

    const newOrder = new Order({
      user: userId,
      items: formattedItems,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        type: shippingAddress.type || 'Home'
      },
      measurement: {
        profileName: measurement.profileName,
        chest: String(measurement.chest),
        waist: String(measurement.waist),
        shoulder: String(measurement.shoulder),
        length: String(measurement.length),
        fitType: measurement.fitType || 'Regular Fit'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery (COD)',
      paymentStatus: isOnlinePayment ? 'Paid' : 'Pending',
      totalAmount: Number(totalAmount),
      orderStatus: 'Pending'
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: 'Order placed successfully!',
      order: savedOrder
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({ 
      message: 'Failed to place order.', 
      error: error.message 
    });
  }
};

// ==========================================
// 2. GET LOGGED-IN USER'S ORDERS
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    return res.status(500).json({ message: 'Error fetching orders.' });
  }
};

// ==========================================
// 3. GET ORDER STATS 
// ==========================================
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; 
    const { range = '6months' } = req.query;

    let startDate = new Date();
    if (range === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === '6months') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (range === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (range === 'all') {
      startDate = new Date(0);
    }

    const matchStage = {
      user: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: startDate },
      orderStatus: { $ne: 'Cancelled' }
    };

    const kpiAggregation = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalGarments: { $sum: { $sum: '$items.quantity' } },
          avgTurnaroundMs: {
            $avg: {
              $cond: [
                { $and: ['$deliveredAt', '$createdAt'] },
                { $subtract: ['$deliveredAt', '$createdAt'] },
                null
              ]
            }
          }
        }
      }
    ]);

    const kpiData = kpiAggregation[0] || {
      totalSpent: 0,
      totalOrders: 0,
      totalGarments: 0,
      avgTurnaroundMs: 0
    };

    const totalSpent = kpiData.totalSpent || 0;
    const totalOrders = kpiData.totalOrders || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    
    const turnaroundDays = kpiData.avgTurnaroundMs
      ? Number((kpiData.avgTurnaroundMs / (1000 * 60 * 60 * 24)).toFixed(1))
      : 4.0;

    const spendingHistory = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          amount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedSpending = spendingHistory.map((item) => ({
      month: monthNames[item._id.month - 1],
      amount: item.amount
    }));

    const categoryAggregation = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          count: { $sum: '$items.quantity' }
        }
      }
    ]);

    const totalItems = categoryAggregation.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const badgeColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];

    const categories = categoryAggregation.map((cat, idx) => ({
      name: cat._id || 'General',
      count: cat.count,
      percentage: Math.round((cat.count / totalItems) * 100),
      color: badgeColors[idx % badgeColors.length]
    }));

    const fabricAggregation = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.fabric',
          count: { $sum: '$items.quantity' }
        }
      }
    ]);

    const fabricPalette = ['#6f42c1', '#0d6efd', '#fd7e14', '#20c997', '#d63384'];
    const fabrics = fabricAggregation.map((fab, idx) => ({
      name: fab._id || 'Standard Blend',
      percentage: Math.round((fab.count / totalItems) * 100),
      color: fabricPalette[idx % fabricPalette.length]
    }));

    return res.status(200).json({
      message: 'Order statistics calculated successfully',
      stats: {
        totalSpent,
        avgOrderValue,
        totalGarments: kpiData.totalGarments || 0,
        turnaroundDays,
        spendingHistory: formattedSpending.length > 0 ? formattedSpending : [{ month: 'Current', amount: totalSpent }],
        categories: categories.length > 0 ? categories : [{ name: 'None', count: 0, percentage: 0, color: 'bg-secondary' }],
        fabrics: fabrics.length > 0 ? fabrics : [{ name: 'None', percentage: 0, color: '#6c757d' }]
      }
    });

  } catch (error) {
    console.error('Order Stats Error:', error);
    return res.status(500).json({ message: 'Error calculating order statistics.' });
  }
};

// ==========================================
// 4. GET ALL ADMIN ORDERS (🚨 Puthusa add pannathu)
// ==========================================
const getAllAdminOrders = async (req, res) => {
  try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "All orders fetched successfully", orders: orders });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching admin orders", error: err.message });
  }
};

// ==========================================
// 5. UPDATE ORDER STATUS (🚨 Puthusa add pannathu)
// ==========================================
const updateOrderStatus = async (req, res) => {
  try {
      const orderId = req.params.id;
      const { orderStatus } = req.body;
      
      const updatedOrder = await Order.findByIdAndUpdate(
          orderId, 
          { orderStatus: orderStatus, updatedAt: Date.now() }, 
          { returnDocument: 'after' }
      );
      
      if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating order status", error: err.message });
  }
};


module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrderStats,
  getAllAdminOrders, 
  updateOrderStatus
};