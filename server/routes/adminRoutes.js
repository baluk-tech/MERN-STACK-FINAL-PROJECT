const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController.js');
const { adminAuthMiddleware } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/imageUploadMeddileware.js');

router.get('/users', adminAuthMiddleware, adminController.getAllUsers);
router.put('/block-user/:id', adminAuthMiddleware, adminController.toggleBlockUser);
router.post('/add-product', adminAuthMiddleware, upload.single('image'), adminController.addProduct);
router.put('/edit-product/:id', adminAuthMiddleware, upload.single('image'), adminController.editProduct);
router.delete('/delete-product/:id', adminAuthMiddleware, adminController.deleteProduct);
router.get('/all-products', adminController.allProducts);


module.exports = router;