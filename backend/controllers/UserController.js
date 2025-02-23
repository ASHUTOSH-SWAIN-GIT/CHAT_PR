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

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.username === trimmedUsername ? "Username already exists" : "Email already exists"
            });
        }

        // Create new user (userId will be generated automatically)
        const user = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            password // Assume hashing is handled in model middleware
        });

        await user.save();

        // Generate JWT token
        const token = JWT.sign({ id: user._id, userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, userId: user.userId, username: user.username, email: user.email }
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

        // Input validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Find user by username
        const user = await User.findOne({ username }).select('+password'); // Include password field
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" // Generic message for security
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate JWT Token
        const token = JWT.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Return success response with token
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            token // Send token in response
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

;

// search for a user
exports.SearchUser = async (req, res) => {
    try {
        let username = req.query.username; 

        if (!username) {
            return res.status(400).json({ success: false, message: "username is required" })
        }

        username = String(username)

        const users = await User.find({
            username: { $regex: new RegExp(username,"i") }
        }).select("username email")

        res.status(200).json({ success: true, users })

    } catch (error) {
        console.error("Error searching users:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}
