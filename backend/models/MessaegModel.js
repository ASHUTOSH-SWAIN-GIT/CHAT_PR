const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: String, required: true }, // Change from ObjectId to String
    receiverId: { type: String, required: true }, // Change from ObjectId to String
    text: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
