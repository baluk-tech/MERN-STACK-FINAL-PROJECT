const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String, default: 'Home' }
});

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true, lowercase: true},
    password:{type:String, required:true},
    resetPasswordToken: {type:String}, 
    expireAt: {type: Date},
    oauthUserToken: {type:String},
    lastName:{type:String},
    phone:{type:Number},
    addresses: [addressSchema], 
    profilePicture:{type:String},
    gender:{type:String, enum:["Male", "Female", "Other"]},
    dob:{type:Date},
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isBlocked: { type: Boolean, default: false },
}, {timestamps:true});

module.exports = mongoose.model("User", userSchema);