const express = require("express")
const router = express.Router()
// start a new conversation 
router.post("/",(req,res)=>{
    res.send("hi")
})
// get all conversation of the user
router.get("/:userid",(req,res)=>{
    res.send("get all conversation of the user")
})


