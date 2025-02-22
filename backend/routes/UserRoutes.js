const express = require("express");
const router = express.Router();
const { RegisterUser,Login } = require("../controllers/UserController");

// Register route
router.post("/register", RegisterUser);

// Dummy login and profile routes
router.post("/login",Login);

// search for users

router.get("/profile", (req, res) => {
    res.send("Welcome to your profile");
});

module.exports = router;
