const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Measurement = require("../models/Measurement");
const { aiGeneratedMeasurement, aiChatService } = require("../services/aiMeasurementService");
const path = require("path");
const bcrypt = require("bcrypt")

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -oauthUserToken -resetPasswordToken -expireAt");
        if(!user) return res.status(404).send({ message: "User not found"});

        const userObj = user.toObject();
        if (userObj.dob) userObj.dob = userObj.dob.toISOString().split("T")[0];

        return res.send({ user: userObj });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const saveProfile = async (req, res) => {
    const { name, lastName, phone, email, gender, dob, address } = req.body;
    const profilePicture = req.file ? req.file.path : null;
    const profilePictureBaseName = profilePicture ? path.basename(profilePicture) : null;
    try {
        const updateData = { name, lastName, phone, email, gender, dob, address };
        if (profilePictureBaseName) updateData.profilePicture = profilePictureBaseName;

        const user = await User.findOneAndUpdate({ _id: req.user._id }, updateData, { returnDocument: "after" })
            .select("-password -oauthUserToken -resetPasswordToken -expireAt");
            
        if(!user) return res.status(404).send({ message: "User not found"});

        const userObj = user.toObject();
        if (userObj.dob) userObj.dob = userObj.dob.toISOString().split("T")[0];
        
        return res.send({message: "Profile updated successfully", user: userObj});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

//  UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user._id);
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        
        await user.save();
        
        return res.status(200).json({ 
            message: "Profile updated successfully!", 
            user: { name: user.name, email: user.email, phone: user.phone } 
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

//  CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        // Pazhaya password correct-a nu check pandrom
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password!" });
        }

        // Puthu password-a hash panni save pandrom
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        
        return res.status(200).json({ message: "Password changed successfully!" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const measurement = async (req, res) => {
    try {
        // findOne thookittu find podrom (List edukka)
        const measures = await Measurement.find({ userId: req.user._id }).sort({ createdAt: -1 });
        // Frontend array of objects ethirpaakkuthu
        return res.send(measures); 
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// ADD NEW PROFILE
const addMeasurement = async (req, res) => {
    // req.body-la ippo flat object varum (shirt, pant nu pirikka thevayilla)
    try {
        const measure = new Measurement({
            ...req.body,
            userId: req.user._id
        });
        await measure.save();
        return res.status(201).send({ message: "Measurement profile added successfully", user: measure });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// UPDATE EXISTING PROFILE
const updateMeasurement = async (req, res) => {
    try {
        // ID vechu thedi update pandrom
        const measure = await Measurement.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body }, 
            { new: true }
        );
        if (!measure) return res.status(404).send({ message: "Measurement profile not found" });
        return res.send({ message: "Measurement profile updated successfully", user: measure });
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// DELETE PROFILE (Pudhusa add pannathu)
const deleteMeasurement = async (req, res) => {
    try {
        await Measurement.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        return res.send({ message: "Measurement profile deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// AI IMAGE MEASUREMENT (Fixed for Buffer/Memory Storage)
const aiImageMeasurement = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        // 🚨 Mela sonna mathiri 'buffer' use panni direct-a edukurom 🚨
        const base64Image = req.file.buffer.toString('base64');
        const imageUri = `data:${req.file.mimetype};base64,${base64Image}`;
        
        const aiMeasurement = await aiGeneratedMeasurement(imageUri);
        
        if (!aiMeasurement?.choices || !aiMeasurement.choices[0]?.message?.content) {
            return res.status(400).send({ message: "Could not generate measurements from the image"});
        }

        // AI tharra thevayillatha ```json text-a remove pandrom
        let rawContent = aiMeasurement.choices[0].message.content;
        rawContent = rawContent.replace(/```json/gi, '').replace(/```/gi, '').trim();
        
        const parsedmeasure = JSON.parse(rawContent);
        
        return res.send(parsedmeasure);
    } catch (err) {
        console.error("Backend AI Error:", err);    
        return res.status(500).json({ message: err.message });
    }
}

// ASK AI CHATBOT FUNCTION
// ==========================================
const askAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // OpenRouter ethirpaakkura format-la message-a pass pandrom
        const messageHistory = [{ role: "user", content: prompt }];
        
        // aiMeasurementService.js la irunthu antha function-a call pandrom
        const reply = await aiChatService(messageHistory);
        
        return res.status(200).json({ reply });
    } catch (err) {
        console.error("Ask AI Error:", err);
        return res.status(500).json({ message: "Failed to connect with StitchAI Assistant" });
    }
};

// PUDHU FUNCTION: Address Add panna
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ message: "User not found" });

        // User profile-la puthu address-a push pandrom
        user.addresses.push(req.body);
        await user.save();

        return res.send({ message: "Address added successfully", addresses: user.addresses });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// ==========================================
// PUDHU WISHLIST FUNCTIONS
// ==========================================

// 1. ADD TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);
        
        // Already wishlist-la illana mattum add pandrom
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        return res.status(200).json({ message: "Added to Favourites", wishlist: user.wishlist });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// 2. REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        
        // Antha specific product-a mattum filter panni thookudrom
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        
        return res.status(200).json({ message: "Removed from Favourites", wishlist: user.wishlist });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// 3. GET USER'S WISHLIST
const getWishlist = async (req, res) => {
    try {
        // User-a thedi, avanga wishlist ulla irukka Product details-ayum (populate) onna edukkurom
        const user = await User.findById(req.user._id).populate('wishlist');
        return res.status(200).json(user.wishlist);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
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
};