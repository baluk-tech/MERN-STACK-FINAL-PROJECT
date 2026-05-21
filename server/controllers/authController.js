const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware.js');
const { default: mongoose } = require('mongoose');

const login = async (req, res) => {
    const data = req.body;
    if (data.email === "admin@example.com" && data.password === "admin123") {
        const token = jwt.sign({ email: data.email, admin: true}, process.env.SECRET_KEY);
        res.send({message: "Admin login successful", token});
    } else {
        if (data.email) {
            try {
                const user = await User.findOne({
                    email: data.email
                }).lean();
                if (!user) {
                    return res.status(401).send({message: "User Not Found"});
                }
                const isPasswordMatch = await bcrypt.compare(data.password, user.password);
                if (!isPasswordMatch) {
                    return res.status(401).send({message: "Invalid email or password"});
                }
                const token = jwt.sign(user, process.env.SECRET_KEY)
                return res.send({message: "User login successful", token});
            } catch (err) {
                return res.status(500).send({message: "Error checking user existence", err});
            }
        } else {
            return res.status(400).send({message: "Email is required"});
        }
    }
}

const register = async (req, res) => {
    const data = req.body;
    try {
        const passwordHash = await bcrypt.hash(data.password, 10);
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: passwordHash
        })
        await newUser.save();
        return res.send({message: "User registered successfully"});
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({message: "Validation error", err});
        } else if (err.code === 11000) {
            return res.status(400).send({message: "Email already exists", err});
        } else {
            return res.status(500).send({message: "Error registering user", err});
        }
    }
}

module.exports = { login, register };