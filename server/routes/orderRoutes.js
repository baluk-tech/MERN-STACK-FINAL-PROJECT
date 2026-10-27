const express = require('express');
const router = express.Router();

// Import your auth middleware
const { authMiddleware } = require('../middleware/authMiddleware'); 

const {
  createOrder,
  getMyOrders,
  getOrderStats,
  getAllAdminOrders,
  updateOrderStatus
} = require('../controllers/orderController');

// User Routes
router.post('/create', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/order-stats', authMiddleware, getOrderStats);

// 🚨 Admin Routes (Puthusa add pannathu) 🚨
router.get('/admin/all-orders', getAllAdminOrders);
router.put('/admin/status/:id', updateOrderStatus);

module.exports = router;