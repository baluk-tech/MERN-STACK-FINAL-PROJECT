const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // 🚨 PUDHU FIELDS FOR MULTIPLE PROFILES 🚨
    profileName: { type: String, required: true }, // e.g., "My Regular Fit", "Brother's Fit"
    fitType: { type: String, default: 'Regular Fit' },
    
    // 🚨 FLATTENED MEASUREMENTS 🚨
    // Shirt Measurements
    neck: Number,
    shoulder: Number,
    chest: Number,
    waist: Number,
    hip: Number,
    sleeveLength: Number,
    armhole: Number,
    bicep: Number,
    wrist: Number,
    shirtLength: Number,
    
    // Pant Measurements
    pantWaist: Number, // renamed to avoid clash with shirt waist
    pantHip: Number, // renamed to avoid clash with shirt hip
    thigh: Number,
    knee: Number,
    bottom: Number,
    inseam: Number,
    outseam: Number,
    rise: Number,
    pantLength: Number,
    ankle: Number,

    height: Number,
    addNotes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Measurement", measurementSchema);