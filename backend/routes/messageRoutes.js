const express = require("express")
const router = express.Router()

// send message 
router.post("/send",(req,res)=>{
    res.send("send any message")
})
// get all messages in a conversations 
router.get("/:id",(req,res)=>{
    res.send("send any message")
})









module.exports = router