const User = require('../models/User.js');
const Product = require('../models/Product.js');
const path = require('path');

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().sort({ createdAt: -1 });
        return res.send({message: "Users fetched successfully", users: allUsers});
    } catch (err) {
        return res.status(500).send({message: "Error fetching users", err});
    }
}

const addProduct = async (req, res) => {
    const { title, description, price, category, material, stockLimit } = req.body;
    const image = req.file ? req.file.path : null;
    const imageBaseName = image ? path.basename(image) : null;
    try {
        const newProduct = new Product({
            title,
            description,
            price,
            category,
            material,
            image: imageBaseName,
            stockLimit
        });
        await newProduct.save();
        return res.send({message: "Product added successfully", product: newProduct});
    } catch (err) {
        return res.status(500).send({message: "Error adding product", err});
    }
}

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, price, category, material, stockLimit } = req.body;
        
        // 🚨 FIXED: Pudhu photo iruntha mattum image-a update pannum, illana pazhaya photo-ve irukkum
        let updateData = { title, description, price, category, material, stockLimit };
        if (req.file) {
            updateData.image = path.basename(req.file.path);
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            updateData,
            { returnDocument: "after" }
        );

        if (!updatedProduct) {
            return res.send({message: "Product not found!", id});
        }
        return res.send({message: "Product edited successfully", product: updatedProduct});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: "Error editing product!", err});
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteProduct = await Product.findByIdAndDelete(id)
        
        return res.send({message: "Product deleted successfully", product: deleteProduct})
    } catch (err) {        
        return res.status(500).send({message: "Error deleting product!", err});
    }
}

const allProducts = async (req, res) => {
    try {
        const { search, category, price, sort } = req.query;
        let query = {};  
        if(search) query.title = {$regex: search, $options: "i"};
        if(category) query.category = category;
        if (price) {
            if (price === "0-500") {
                query.price = { $gte: 0, $lte: 500 };
            } else if (price === "500-1000") {
                query.price = { $gte: 500, $lte: 1000 };
            } else if (price === "1000-2000") {
                query.price = { $gte: 1000, $lte: 2000 };
            } else if (price === "2000-plus") {
                query.price = { $gte: 2000 };
            }
        }
        let sortConfig = {};
        if (sort) {
            if (sort === "price_asc") {
                sortConfig.price = 1;
            } else if (sort === "price_desc") {
                sortConfig.price = -1;
            }
        }
        let allProducts = await Product.find(query).sort(sortConfig);
    
        return res.send({message: "Products fetched successfully", allProducts: allProducts});
    } catch (err) {        
        return res.status(500).send({message: "Error fetching products!"});
    }
}

// Block or Unblock User
const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const User = require('../models/User'); // Model path correct-a irukka nu paathukonga
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Admin-a block panna mudiyathu nu oru safety
        if (user.role === 'admin') {
            return res.status(400).json({ message: "You cannot block an Admin!" });
        }

        // Status-a maathurom (True to False / False to True)
        user.isBlocked = !user.isBlocked;
        await user.save();

        return res.status(200).json({ 
            message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully!`, 
            isBlocked: user.isBlocked 
        });
    } catch (err) {
        return res.status(500).json({ message: "Error updating user status", error: err.message });
    }
};

module.exports = { getAllUsers, addProduct, editProduct, deleteProduct, allProducts, toggleBlockUser };