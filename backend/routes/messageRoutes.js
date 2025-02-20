const express = require("express")
const router = express.Router()
const {SendMessage,getMessages}  = require(`../controllers/MessageController`)

// send message 
router.post("/send",SendMessage)
// get all messages in a conversations 
router.get("/:id",getMessages)
module.exports = router