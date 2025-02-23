const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const mongoose = require(`mongoose`)
const User = require(`../models/Usermodel`)

// Send message
exports.SendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        if (!senderId || !receiverId || !text) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // ✅ Convert senderId & receiverId to ObjectId (if using MongoDB _id)
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, message: "Invalid sender or receiver ID format" });
        }

        // ✅ Check if sender & receiver exist in the database
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "Sender or receiver not found" });
        }

        // ✅ Check if conversation exists between them
        let conversation = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // ✅ If no conversation exists, create one
        if (!conversation) {
            conversation = new Chat({
                participants: [senderId, receiverId],
                lastMessage: null
            });
            await conversation.save();
        }

        // ✅ Create and save the new message
        const newMessage = new Message({
            conversationId: conversation._id,
            senderId,
            receiverId,
            text
        });

        const savedMessage = await newMessage.save();

        // ✅ Update last message in the chat
        conversation.lastMessage = savedMessage._id;
        await conversation.save();

        // ✅ Emit message to connected clients via socket.io
        req.app.get("io").to(conversation._id.toString()).emit("receive_message", savedMessage);

        res.status(200).json({ success: true, message: "Message sent successfully!", data: savedMessage });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// Get all messages of a conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            return res.status(400).json({ success: false, message: "Conversation ID is required" });
        }

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
