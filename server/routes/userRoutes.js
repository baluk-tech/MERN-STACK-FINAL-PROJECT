const express = require("express")
const router = express.Router();
const multer = require("multer");

const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require('../middleware/imageUploadMeddileware.js');

const { 
    getProfile, 
    saveProfile, 
    updateProfile,
    changePassword,
    measurement, 
    addMeasurement, 
    updateMeasurement, 
    deleteMeasurement, 
    aiImageMeasurement,
    askAI,
    addAddress,
    addToWishlist,
    removeFromWishlist,
    getWishlist
} = require("../controllers/userController.js");

router.post("/address/add", authMiddleware, addAddress);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single('profilePicture'), saveProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.put("/profile/change-password", authMiddleware, changePassword);

router.post('/wishlist/add', authMiddleware, addToWishlist);
router.delete('/wishlist/remove/:productId', authMiddleware, removeFromWishlist);
router.get('/wishlist', authMiddleware, getWishlist);

router.get('/measurement/me', authMiddleware, measurement);
router.post('/measurement/add', authMiddleware, addMeasurement);
router.put('/measurement/update/:id', authMiddleware, updateMeasurement);
router.delete('/measurement/delete/:id', authMiddleware, deleteMeasurement);

router.post('/ask-ai', authMiddleware, askAI);

var memStorage = multer.memoryStorage()
var memUpload = multer({ storage: memStorage })
router.post("/ai-image-measurement", authMiddleware, memUpload.single('image'), aiImageMeasurement);


module.exports = router;    
