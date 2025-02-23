const express = require("express");
const router = express.Router();
const { RegisterUser,Login,SearchUser } = require("../controllers/UserController");
const User = require(`../models/Usermodel`)
const authenticateUser = require(`../middleware/Authmiddleware`)

// Register route
router.post("/register", RegisterUser);

// Dummy login and profile routes
router.post("/login",Login);

// search for users
router.get("/search", authMiddleware,SearchUser);

// Route to get user ID by username
router.get("/getUserId/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ userId: user._id });
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/profile", (req, res) => {
    res.send("Welcome to your profile");
});

module.exports = router;
