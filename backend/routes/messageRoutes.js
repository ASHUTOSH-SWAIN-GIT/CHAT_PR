const express = require("express")
const router = express.Router()
const {SendMessage}  = require(`../controllers/MessageController`)

// send message 
router.post("/send",SendMessage)
// get all messages in a conversations 
router.get("/:id",(req,res)=>{
    res.send("send any message")
})









module.exports = router