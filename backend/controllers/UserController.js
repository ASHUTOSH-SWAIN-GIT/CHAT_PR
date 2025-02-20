const { subSeconds } = require("date-fns");
const User = require("../models/Usermodel");
const JWT = require("jsonwebtoken");
const bcrypt = require(`bcrypt`)

// Register a user
exports.RegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const trimmedUsername = username.trim().toLowerCase();
        const trimmedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.username === trimmedUsername ? "Username already exists" : "Email already exists"
            });
        }

        // Create new user (password will be hashed automatically in User model)
        const user = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            password // No need to hash here
        });

        await user.save();

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// login a user 
exports.Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All the fields are required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ success: false, message: "Username not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ 
            success: true, 
            message: "Login successful!", 
            token 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
