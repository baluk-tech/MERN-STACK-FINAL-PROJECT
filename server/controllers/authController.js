const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware.js');
const { default: mongoose } = require('mongoose');
const axios = require('axios');

const login = async (req, res) => {
    const data = req.body;
    if (data.email === "admin@example.com" && data.password === "admin123") {
        const token = jwt.sign({ email: data.email, admin: true}, process.env.SECRET_KEY);
        res.send({message: "Admin login successful", token, role: "admin"});
    } else {
        if (data.email) {
            try {
                const user = await User.findOne({
                    email: data.email
                }).lean();
                if (!user) {
                    return res.status(401).send({message: "User Not Found"});
                }
                if (user.isBlocked) {
                    return res.status(403).json({ message: "Your account has been blocked by Admin. Contact support." });
                }
                const isPasswordMatch = await bcrypt.compare(data.password, user.password);
                if (!isPasswordMatch) {
                    return res.status(401).send({message: "Invalid email or password"});
                }
                const token = jwt.sign(user, process.env.SECRET_KEY)
                return res.send({message: "User login successful", token, role: "user"});
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
            console.log(err);
            
            return res.status(400).send({message: "Validation error", err});
        } else if (err.code === 11000) {
            return res.status(400).send({message: "Email already exists", err});
        } else {
            return res.status(500).send({message: "Error registering user", err});
        }
    }
}

const oauthLogin = async (req, res) => {
    const { token } = req.body;
    try {
       
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const user = response.data;
        const existingUser = await User.findOne({
            email: user.email
        }).lean();
        if (existingUser) {
            if (existingUser.isBlocked) {
                return res.status(403).send({message: "Your account has been blocked by Admin. Contact support."});
            }
            return res.send({message: "OAuth login successful", token:jwt.sign(existingUser, process.env.SECRET_KEY)});
        }
        const oauthUser = new User({
            name: user.name,
            email: user.email,
            password: "oauth_user",
            oauthUserToken: token
        })
        await oauthUser.save();
        // Here you would typically check if the user exists in your database and create a session or token
        return res.send({message: "OAuth login successful", token:jwt.sign(oauthUser.toObject(), process.env.SECRET_KEY)});
    } catch (err) {
        console.log(err);
        
        return res.status(500).send({message: "Error during OAuth login", err});
    }
}

module.exports = { login, register, oauthLogin };