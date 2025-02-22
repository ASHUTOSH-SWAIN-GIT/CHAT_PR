const express = require("express");
const router = express.Router();
const { RegisterUser,Login,SearchUser } = require("../controllers/UserController");

// Register route
router.post("/register", RegisterUser);

// Dummy login and profile routes
router.post("/login",Login);

// search for users
router.get("/search", SearchUser);


router.get("/profile", (req, res) => {
    res.send("Welcome to your profile");
});

module.exports = router;
