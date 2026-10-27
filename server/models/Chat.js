const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: [
        {
            role: {
                type: String,
                enum: ["user", "assistant", "system"],
                required: true
            },
            content: [
                {
                    type: { type: String, enum: ["text", "image_url"], required: true },
                    type: { type: String },
                    image_url: {
                        url: { type: String }
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);