const User = require('../models/User.js');
const Product = require('../models/Product.js');
const path = require('path');

const getAllProducts = async (req, res) => {
    try {
        const { search, category, price, sort, page = 1, limit = 10 } = req.query
        let query = {}  
        if(search) query.title = {$regex: search, $options: "i"}

        if(category) query.category = {$regex: category, $options: "i"}

        if (price) {
            if (price === "0-500") {
                query.price = { $gte: 0, $lte: 500 };
            } else if (price === "500-1000") {
                query.price = { $gte: 500, $lte: 1000 };
            } else if (price === "1000-2000") {
                query.price = { $gte: 1000, $lte: 2000 };
            } else if (price === "2000-plus") {
                query.price = { $gte: 0 };
            }
        }

        let sortConfig = {}
        if (sort) {
            if (sort === "price_asc") {
                sortConfig.price = 1;
            } else if (sort === "price_desc") {
                sortConfig.price = -1;
            }
        }

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const skip = (pageNumber - 1) * limitNumber;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNumber);

        const products = await Product.find(query).sort(sortConfig).skip(skip).limit(limitNumber);

        return res.send({message: "Products fetched successfully", products: products, totalProducts: totalProducts, totalPages: totalPages})
    } catch (err) {        
        return res.status(500).send({message: "Error fetching products!"})
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        return res.status(200).send({ product });
    } catch (error) {
        console.error("Error fetching single product:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { getAllProducts, getProductById };