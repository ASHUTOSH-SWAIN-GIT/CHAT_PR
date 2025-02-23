const express = require("express");
const router = express.Router();
const { SendMessage, getMessages } = require("../controllers/MessageController");

// Send message
router.post("/send", SendMessage);

// Get all messages in a conversation
router.get("/:conversationId", getMessages);

// mark as read 
router.post("/markAsRead/:messageId", async (req, res) => {
    try {
        const { messageId } = req.params;

        await Message.findByIdAndUpdate(messageId, { isRead: true });

        res.json({ success: true, message: "Message marked as read" });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
