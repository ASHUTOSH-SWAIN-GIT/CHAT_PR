const Chat = require(`../models/ChatModel`);
const Message = require(`../models/MessaegModel`);

exports.SendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, text } = req.body;

        if (!conversationId || !senderId || !receiverId || !text) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Create new message
        const newMessage = new Message({
            conversationId,
            senderId,
            receiverId,
            text
        });

        const savedMessage = await newMessage.save();

        // Update lastMessage in the chat
        await Chat.findByIdAndUpdate(conversationId, { lastMessage: savedMessage._id });

        res.status(200).json({ success: true, message: "Message sent successfully!", data: savedMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
