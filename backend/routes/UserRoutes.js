const express = require("express");
const router = express.Router();
const { RegisterUser } = require("../controllers/UserController");

// Register route
router.post("/register", RegisterUser);

// Dummy login and profile routes
router.get("/login", (req, res) => {
    res.send("Welcome to login");
});

router.get("/profile", (req, res) => {
    res.send("Welcome to your profile");
});

module.exports = router;
