const Chat = require(`../models/ChatModel`);
const Message = require(`../models/MessaegModel`);


// send message 
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


// get all  messages of a conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.body

    if (!conversationId) {
        return res.status(400).json({ success: false, message: "conversation id is required" })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
