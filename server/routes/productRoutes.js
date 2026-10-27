const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productController.js");

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);

module.exports = router;