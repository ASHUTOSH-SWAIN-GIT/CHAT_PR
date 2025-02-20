const mongoose = require("mongoose")


const Messageschema =  new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
},{timestamps:true})

module.exports = mongoose.model("Message",Messageschema)