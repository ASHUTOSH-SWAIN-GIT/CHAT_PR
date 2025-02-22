const express = require("express");
const router = express.Router();
const { SendMessage, getMessages } = require("../controllers/MessageController");

// Send message
router.post("/send", SendMessage);

// Get all messages in a conversation
router.get("/:conversationId", getMessages);

module.exports = router;
